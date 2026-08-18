<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UpdateCategoryAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function execute(Category $category, array $data, ?UploadedFile $image = null): Category
    {
        if (isset($data['name']) && ! isset($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        // Handle image removal
        if (isset($data['remove_image']) && $data['remove_image']) {
            if ($category->image_path) {
                Storage::disk('public')->delete($category->image_path);
            }
            $data['image_path'] = null;
            unset($data['remove_image']);
        }

        if ($image) {
            // Delete old image
            if ($category->image_path) {
                Storage::disk('public')->delete($category->image_path);
            }

            $data['image_path'] = $image->store('categories', 'public');
        }

        $category->update($data);

        return $category->fresh();
    }
}

