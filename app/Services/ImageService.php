<?php

declare(strict_types=1);

namespace App\Services;

use GdImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Max target file size in bytes (2 MB = 2,097,152 bytes).
     */
    public const MAX_FILE_SIZE_BYTES = 2097152;

    /**
     * Maximum canvas dimension in pixels for product square canvas (e.g. 1600px).
     * Provides ultra crisp rendering for 4K / Retina displays while preventing bloated file sizes.
     */
    public const MAX_PRODUCT_CANVAS_DIMENSION = 1600;

    /**
     * Store uploaded product image with:
     * 1. Automatic 1:1 square white canvas formatting (transparency / black background converted to pure white #FFFFFF).
     * 2. Automatic compression to ensure file size is strictly less than 2MB.
     *
     * @param UploadedFile|string $file
     * @param string $directory
     * @param string $disk
     * @param int $maxSizeBytes
     * @return string Stored file path relative to disk
     */
    public static function storeWithWhiteBackground(
        UploadedFile|string $file,
        string $directory = 'products',
        string $disk = 'public',
        int $maxSizeBytes = self::MAX_FILE_SIZE_BYTES
    ): string {
        $isUploaded = $file instanceof UploadedFile;

        if ($isUploaded) {
            $realPath = $file->getRealPath();
            $mimeType = $file->getMimeType() ?: 'image/jpeg';
        } else {
            $realPath = $file;
            $mimeType = mime_content_type($realPath) ?: 'image/jpeg';
        }

        if (! $realPath || ! file_exists($realPath)) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $content = file_get_contents($realPath);
        if ($content === false) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $srcImage = @imagecreatefromstring($content);
        if (! $srcImage) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $origWidth = imagesx($srcImage);
        $origHeight = imagesy($srcImage);

        // 1. Detect transparency (alpha channel > 0)
        $hasTransparency = false;
        $stepX = max(1, (int) ($origWidth / 100));
        $stepY = max(1, (int) ($origHeight / 100));

        for ($x = 0; $x < $origWidth; $x += $stepX) {
            for ($y = 0; $y < $origHeight; $y += $stepY) {
                $color = imagecolorat($srcImage, $x, $y);
                $alpha = ($color >> 24) & 0x7F;
                if ($alpha > 0) {
                    $hasTransparency = true;
                    break 2;
                }
            }
        }

        // 2. Detect solid black / near-black background in corners
        $hasBlackBackground = false;
        if (! $hasTransparency) {
            $corners = [
                [0, 0],
                [$origWidth - 1, 0],
                [0, $origHeight - 1],
                [$origWidth - 1, $origHeight - 1],
            ];
            $blackCorners = 0;
            foreach ($corners as [$cx, $cy]) {
                $c = imagecolorat($srcImage, $cx, $cy);
                $r = ($c >> 16) & 0xFF;
                $g = ($c >> 8) & 0xFF;
                $b = $c & 0xFF;
                if ($r < 25 && $g < 25 && $b < 25) {
                    $blackCorners++;
                }
            }
            if ($blackCorners >= 3) {
                $hasBlackBackground = true;
            }
        }

        // Determine 1:1 square canvas dimension (with 10% breathing margin)
        $maxDim = max($origWidth, $origHeight);
        $rawSquareSize = (int) ($maxDim * 1.10);

        // Cap square canvas dimension to MAX_PRODUCT_CANVAS_DIMENSION to keep memory and crispness optimal
        $squareSize = min($rawSquareSize, self::MAX_PRODUCT_CANVAS_DIMENSION);
        $scaleFactor = $squareSize / (float) $rawSquareSize;

        $targetWidth = max(1, (int) round($origWidth * $scaleFactor));
        $targetHeight = max(1, (int) round($origHeight * $scaleFactor));
        $dstX = (int) (($squareSize - $targetWidth) / 2);
        $dstY = (int) (($squareSize - $targetHeight) / 2);

        // Create 1:1 square canvas filled with white background
        $canvas = imagecreatetruecolor($squareSize, $squareSize);
        if (! $canvas) {
            imagedestroy($srcImage);

            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagefill($canvas, 0, 0, $white);

        if ($hasTransparency) {
            // Composite transparent image centered onto white square canvas
            imagealphablending($canvas, true);
            imagecopyresampled($canvas, $srcImage, $dstX, $dstY, 0, 0, $targetWidth, $targetHeight, $origWidth, $origHeight);
        } elseif ($hasBlackBackground) {
            // Downscale source if needed, then copy centered and replace black bg with white
            $tempSrc = imagecreatetruecolor($targetWidth, $targetHeight);
            if ($tempSrc) {
                imagecopyresampled($tempSrc, $srcImage, 0, 0, 0, 0, $targetWidth, $targetHeight, $origWidth, $origHeight);
                for ($x = 0; $x < $targetWidth; $x++) {
                    for ($y = 0; $y < $targetHeight; $y++) {
                        $c = imagecolorat($tempSrc, $x, $y);
                        $r = ($c >> 16) & 0xFF;
                        $g = ($c >> 8) & 0xFF;
                        $b = $c & 0xFF;
                        if ($r < 25 && $g < 25 && $b < 25) {
                            imagesetpixel($canvas, $dstX + $x, $dstY + $y, $white);
                        } else {
                            imagesetpixel($canvas, $dstX + $x, $dstY + $y, $c);
                        }
                    }
                }
                imagedestroy($tempSrc);
            }
        } else {
            // Opaque photo - copy centered onto white square canvas
            imagecopyresampled($canvas, $srcImage, $dstX, $dstY, 0, 0, $targetWidth, $targetHeight, $origWidth, $origHeight);
        }

        imagedestroy($srcImage);

        // 3. Compress image until file size is strictly under $maxSizeBytes (<= 2MB)
        $compressed = self::compressGdImage($canvas, $mimeType, $maxSizeBytes);
        imagedestroy($canvas);

        if (empty($compressed['data'])) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $filename = Str::random(40).$compressed['extension'];
        $path = rtrim($directory, '/').'/'.$filename;
        Storage::disk($disk)->put($path, $compressed['data']);

        return $path;
    }

    /**
     * Universal image compress and store method for general uploads (Articles, Categories, Settings, etc.).
     * Resizes if larger than max dimension and compresses to strictly less than $maxSizeBytes.
     */
    public static function compressAndStore(
        UploadedFile|string $file,
        string $directory = 'images',
        string $disk = 'public',
        int $maxSizeBytes = self::MAX_FILE_SIZE_BYTES,
        int $maxDimension = 1920
    ): string {
        $isUploaded = $file instanceof UploadedFile;

        if ($isUploaded) {
            $realPath = $file->getRealPath();
            $mimeType = $file->getMimeType() ?: 'image/jpeg';
        } else {
            $realPath = $file;
            $mimeType = mime_content_type($realPath) ?: 'image/jpeg';
        }

        if (! $realPath || ! file_exists($realPath)) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $content = file_get_contents($realPath);
        if ($content === false) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $srcImage = @imagecreatefromstring($content);
        if (! $srcImage) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $origWidth = imagesx($srcImage);
        $origHeight = imagesy($srcImage);

        // Resize down proportionally if exceeds max dimension
        if ($origWidth > $maxDimension || $origHeight > $maxDimension) {
            $ratio = min($maxDimension / $origWidth, $maxDimension / $origHeight);
            $newWidth = max(1, (int) round($origWidth * $ratio));
            $newHeight = max(1, (int) round($origHeight * $ratio));

            $canvas = imagecreatetruecolor($newWidth, $newHeight);
            if ($canvas) {
                // Preserve transparency for PNG
                imagealphablending($canvas, false);
                imagesavealpha($canvas, true);
                imagecopyresampled($canvas, $srcImage, 0, 0, 0, 0, $newWidth, $newHeight, $origWidth, $origHeight);
                imagedestroy($srcImage);
                $workingImage = $canvas;
            } else {
                $workingImage = $srcImage;
            }
        } else {
            $workingImage = $srcImage;
        }

        $compressed = self::compressGdImage($workingImage, $mimeType, $maxSizeBytes);
        imagedestroy($workingImage);

        if (empty($compressed['data'])) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $filename = Str::random(40).$compressed['extension'];
        $path = rtrim($directory, '/').'/'.$filename;
        Storage::disk($disk)->put($path, $compressed['data']);

        return $path;
    }

    /**
     * Compress a GD image resource iteratively until its byte length is <= $maxSizeBytes.
     *
     * @return array{data: string, extension: string}
     */
    public static function compressGdImage(
        GdImage $image,
        string $mimeType = 'image/jpeg',
        int $maxSizeBytes = self::MAX_FILE_SIZE_BYTES
    ): array {
        $supportsWebp = function_exists('imagewebp');
        $useWebp = ($mimeType === 'image/webp' || $mimeType === 'image/png') && $supportsWebp;

        $extension = $useWebp ? '.webp' : '.jpg';
        $currentImage = $image;
        $createdTemp = false;

        $qualitySteps = [88, 80, 72, 65, 55, 45];
        $outputData = '';

        foreach ($qualitySteps as $quality) {
            ob_start();
            if ($useWebp) {
                imagewebp($currentImage, null, $quality);
            } else {
                imagejpeg($currentImage, null, $quality);
            }
            $outputData = (string) ob_get_clean();

            if (strlen($outputData) <= $maxSizeBytes) {
                if ($createdTemp) {
                    imagedestroy($currentImage);
                }

                return [
                    'data' => $outputData,
                    'extension' => $extension,
                ];
            }
        }

        // If still above max size after lowest quality, scale image down by 25% repeatedly
        while (strlen($outputData) > $maxSizeBytes) {
            $w = imagesx($currentImage);
            $h = imagesy($currentImage);

            if ($w <= 300 || $h <= 300) {
                break; // avoid making it excessively small
            }

            $scaledW = (int) round($w * 0.75);
            $scaledH = (int) round($h * 0.75);

            $scaled = imagecreatetruecolor($scaledW, $scaledH);
            if (! $scaled) {
                break;
            }

            imagecopyresampled($scaled, $currentImage, 0, 0, 0, 0, $scaledW, $scaledH, $w, $h);

            if ($createdTemp) {
                imagedestroy($currentImage);
            }

            $currentImage = $scaled;
            $createdTemp = true;

            ob_start();
            if ($useWebp) {
                imagewebp($currentImage, null, 70);
            } else {
                imagejpeg($currentImage, null, 70);
            }
            $outputData = (string) ob_get_clean();
        }

        if ($createdTemp) {
            imagedestroy($currentImage);
        }

        return [
            'data' => $outputData,
            'extension' => $extension,
        ];
    }
}

