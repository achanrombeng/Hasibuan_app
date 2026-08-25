<?php

declare(strict_types=1);

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageService
{
    /**
     * Store uploaded image.
     * If the image has transparency (such as PNG/WebP with alpha channel),
     * it flattens the image onto a solid white (#FFFFFF) background.
     * If the image is opaque/already has a background, it stores as-is.
     */
    /**
     * Store uploaded image.
     * If the image has transparency (PNG/WebP/GIF with alpha channel) or solid black background,
     * it flattens/converts the image background onto solid white (#FFFFFF).
     * If the image already has a solid non-black background (opaque photo/scene), it stores as-is.
     */
    public static function storeWithWhiteBackground(
        UploadedFile|string $file,
        string $directory = 'products',
        string $disk = 'public'
    ): string {
        $isUploaded = $file instanceof UploadedFile;

        if ($isUploaded) {
            $realPath = $file->getRealPath();
            $mimeType = $file->getMimeType();
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

        $width = imagesx($srcImage);
        $height = imagesy($srcImage);

        // 1. Detect transparency (alpha channel > 0)
        $hasTransparency = false;
        $stepX = max(1, (int) ($width / 100));
        $stepY = max(1, (int) ($height / 100));

        for ($x = 0; $x < $width; $x += $stepX) {
            for ($y = 0; $y < $height; $y += $stepY) {
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
                [$width - 1, 0],
                [0, $height - 1],
                [$width - 1, $height - 1],
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

        // If no transparency AND no black background, store original file as-is
        if (! $hasTransparency && ! $hasBlackBackground) {
            imagedestroy($srcImage);

            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        // Create white canvas
        $canvas = imagecreatetruecolor($width, $height);
        if (! $canvas) {
            imagedestroy($srcImage);

            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagefill($canvas, 0, 0, $white);

        if ($hasTransparency) {
            // Composite transparent image onto white canvas
            imagealphablending($canvas, true);
            imagecopy($canvas, $srcImage, 0, 0, 0, 0, $width, $height);
        } elseif ($hasBlackBackground) {
            // Copy source image to canvas and replace black background pixels with white
            imagecopy($canvas, $srcImage, 0, 0, 0, 0, $width, $height);
            for ($x = 0; $x < $width; $x++) {
                for ($y = 0; $y < $height; $y++) {
                    $c = imagecolorat($srcImage, $x, $y);
                    $r = ($c >> 16) & 0xFF;
                    $g = ($c >> 8) & 0xFF;
                    $b = $c & 0xFF;
                    if ($r < 25 && $g < 25 && $b < 25) {
                        imagesetpixel($canvas, $x, $y, $white);
                    }
                }
            }
        }

        // Save processed output
        ob_start();
        if ($mimeType === 'image/webp' && function_exists('imagewebp')) {
            imagewebp($canvas, null, 92);
            $extension = '.webp';
        } else {
            imagepng($canvas, null, 6);
            $extension = '.png';
        }
        $processedData = ob_get_clean();

        imagedestroy($srcImage);
        imagedestroy($canvas);

        if (! $processedData) {
            return $isUploaded ? $file->store($directory, $disk) : (string) $file;
        }

        $filename = Str::random(40).$extension;
        $path = rtrim($directory, '/').'/'.$filename;
        Storage::disk($disk)->put($path, $processedData);

        return $path;
    }
}
