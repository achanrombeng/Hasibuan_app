<?php

declare(strict_types=1);

namespace App\Actions\Category;

use App\Models\Category;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;

class CreateCategoryAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function execute(array $data, ?UploadedFile $image = null): Category
    {
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        if ($image) {
            $data['image_path'] = $image->store('categories', 'public');
        }

        /** @var Category $category */
        $category = Category::create($data);

        return $category;
    }
}

