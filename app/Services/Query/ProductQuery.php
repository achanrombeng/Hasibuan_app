<?php

declare(strict_types=1);

namespace App\Services\Query;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductQuery
{
    public static function shop(Request $request): QueryBuilder
    {
        return QueryBuilder::for(Product::class, $request)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::callback('search', function ($query, $value) {
                    $query->where(function ($q) use ($value) {
                        $q->where('name', 'like', "%{$value}%")
                            ->orWhere('description', 'like', "%{$value}%")
                            ->orWhere('short_description', 'like', "%{$value}%")
                            ->orWhere('sku', 'like', "%{$value}%");
                    });
                }),
                AllowedFilter::callback('category_id', function ($query, $value) {
                    $categoryIds = Category::where('id', $value)
                        ->orWhere('parent_id', $value)
                        ->pluck('id');
                    $query->whereIn('category_id', $categoryIds);
                }),
                // Filter by category slug for SEO-friendly URLs
                AllowedFilter::callback('category', function ($query, $value) {
                    $category = Category::where('slug', $value)->first();
                    if ($category) {
                        $categoryIds = Category::where('id', $category->id)
                            ->orWhere('parent_id', $category->id)
                            ->pluck('id');
                        $query->whereIn('category_id', $categoryIds);
                    }
                }),
            ])
            ->allowedSorts(['name', 'created_at', 'sold_count', 'average_rating'])
            ->defaultSort('-created_at')
            ->active()
            ->with(['category', 'images']);
    }

    public static function admin(Request $request): QueryBuilder
    {
        return QueryBuilder::for(Product::class, $request)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('is_featured'),
            ])
            ->allowedSorts(['name', 'created_at', 'sold_count'])
            ->with(['category', 'images']);
    }
}
