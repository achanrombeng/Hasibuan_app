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
    public static function storeWithWhiteBackground(
        UploadedFile $file,
        string $directory = 'products',
        string $disk = 'public'
    ): string {
        $mimeType = $file->getMimeType();

        // Only process PNG, WebP, or GIF which support transparency
        if (! in_array($mimeType, ['image/png', 'image/webp', 'image/gif'], true)) {
            return $file->store($directory, $disk);
        }

        $realPath = $file->getRealPath();
        if (! $realPath || ! file_exists($realPath)) {
            return $file->store($directory, $disk);
        }

        $content = file_get_contents($realPath);
        if ($content === false) {
            return $file->store($directory, $disk);
        }

        $srcImage = @imagecreatefromstring($content);
        if (! $srcImage) {
            return $file->store($directory, $disk);
        }

        $width = imagesx($srcImage);
        $height = imagesy($srcImage);

        // Sample pixels to detect transparency (alpha channel > 0)
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

        // If no transparent pixels found, keep original file intact
        if (! $hasTransparency) {
            imagedestroy($srcImage);

            return $file->store($directory, $disk);
        }

        // Create canvas filled with solid white background
        $canvas = imagecreatetruecolor($width, $height);
        if (! $canvas) {
            imagedestroy($srcImage);

            return $file->store($directory, $disk);
        }

        $white = imagecolorallocate($canvas, 255, 255, 255);
        imagefill($canvas, 0, 0, $white);

        // Copy transparent image over solid white canvas with alpha blending enabled
        imagealphablending($canvas, true);
        imagecopy($canvas, $srcImage, 0, 0, 0, 0, $width, $height);

        // Save output to stream buffer
        ob_start();
        if ($mimeType === 'image/webp' && function_exists('imagewebp')) {
            imagewebp($canvas, null, 92);
            $filename = Str::random(40).'.webp';
        } else {
            imagepng($canvas, null, 6);
            $filename = Str::random(40).'.png';
        }
        $processedData = ob_get_clean();

        imagedestroy($srcImage);
        imagedestroy($canvas);

        if (! $processedData) {
            return $file->store($directory, $disk);
        }

        $path = rtrim($directory, '/').'/'.$filename;
        Storage::disk($disk)->put($path, $processedData);

        return $path;
    }
}
