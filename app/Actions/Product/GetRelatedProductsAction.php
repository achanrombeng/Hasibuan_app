<?php

declare(strict_types=1);

namespace App\Actions\Product;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;

class GetRelatedProductsAction
{
    /**
     * Get related products based on category hierarchy.
     * Logic: Same category -> Siblings -> Children
     *
     * @return Collection<int, Product>
     */
    public function execute(Product $product, int $limit = 4): Collection
    {
        $relatedCategoryIds = Category::where('id', $product->category_id)
            ->orWhere('parent_id', $product->category_id) // Children
            ->orWhere(function ($query) use ($product) {
                // Siblings: Same parent_id (if parent_id is not null)
                if ($product->category->parent_id) {
                    $query->where('parent_id', $product->category->parent_id);
                }
            })
            ->pluck('id');

        return Product::active()
            ->whereIn('category_id', $relatedCategoryIds)
            ->where('id', '!=', $product->id)
            ->with(['images', 'category'])
            ->limit($limit)
            ->get();
    }
}
