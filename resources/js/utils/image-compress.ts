/**
 * Utility for compressing images before upload
 */

interface CompressOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
}

/**
 * Compress an image file to a target size
 * @param file - The image file to compress
 * @param options - Compression options
 * @returns Promise<File> - The compressed file
 */
export async function compressImage(
    file: File,
    options: CompressOptions = {},
): Promise<File> {
    const { maxSizeMB = 2, maxWidthOrHeight = 1920, quality = 0.8 } = options;

    // If file is already small enough, return as-is
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size <= maxSizeBytes) {
        return file;
    }

    // Only compress images
    if (!file.type.startsWith('image/')) {
        return file;
    }

    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            // Calculate new dimensions
            let { width, height } = img;
            if (width > maxWidthOrHeight || height > maxWidthOrHeight) {
                if (width > height) {
                    height = (height / width) * maxWidthOrHeight;
                    width = maxWidthOrHeight;
                } else {
                    width = (width / height) * maxWidthOrHeight;
                    height = maxWidthOrHeight;
                }
            }

            canvas.width = width;
            canvas.height = height;

            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw and compress
            ctx.drawImage(img, 0, 0, width, height);

            // Try different quality levels to achieve target size
            const tryCompress = (currentQuality: number): void => {
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'));
                            return;
                        }

                        // If still too large and quality can be reduced, try again
                        if (blob.size > maxSizeBytes && currentQuality > 0.1) {
                            tryCompress(currentQuality - 0.1);
                            return;
                        }

                        // Create new file from blob
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    currentQuality,
                );
            };

            tryCompress(quality);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        img.src = URL.createObjectURL(file);
    });
}

/**
 * Compress multiple image files
 * @param files - Array of files to compress
 * @param options - Compression options
 * @returns Promise<File[]> - Array of compressed files
 */
export async function compressImages(
    files: File[],
    options: CompressOptions = {},
): Promise<File[]> {
    const compressedFiles = await Promise.all(
        files.map((file) => compressImage(file, options)),
    );
    return compressedFiles;
}
