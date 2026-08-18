<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use InvalidArgumentException;

class DeleteCategoryAction
{
    /**
     * Delete a category with option to cascade delete children
     *
     * @param Category $category The category to delete
     * @param bool $cascadeChildren If true, delete all children recursively
     * @throws InvalidArgumentException If category has products or children (when cascade is false)
     */
    public function execute(Category $category, bool $cascadeChildren = true): bool
    {
        // Check if category has products
        if ($category->products()->exists()) {
            throw new InvalidArgumentException('Kategori tidak dapat dihapus karena masih memiliki produk.');
        }

        return DB::transaction(function () use ($category, $cascadeChildren) {
            // Handle children
            if ($category->children()->exists()) {
                if (!$cascadeChildren) {
                    throw new InvalidArgumentException('Kategori tidak dapat dihapus karena masih memiliki sub-kategori.');
                }

                // Recursively delete all children
                foreach ($category->children as $child) {
                    $this->execute($child, true);
                }
            }

            // Delete image if exists
            if ($category->image_path) {
                Storage::disk('public')->delete($category->image_path);
            }

            return (bool) $category->forceDelete();
        });
    }
}
