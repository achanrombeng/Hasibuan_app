<?php

declare(strict_types=1);

namespace App\Services\Query;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductQuery
{
    public static function shop(Request $request): QueryBuilder
    {
        return QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
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
                AllowedFilter::exact('sale_type'),
                AllowedFilter::scope('price_min', 'priceMin'),
                AllowedFilter::scope('price_max', 'priceMax'),
            ])
            ->allowedSorts(['name', 'price', 'created_at', 'sold_count', 'average_rating', 'discount_percentage'])
            ->active()
            ->with(['category', 'images']);
    }

    public static function admin(Request $request): QueryBuilder
    {
        return QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::partial('name'),
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('sale_type'),
                AllowedFilter::exact('is_featured'),
                AllowedFilter::scope('stock'),
            ])
            ->allowedSorts(['name', 'price', 'stock_quantity', 'created_at', 'sold_count'])
            ->with(['category', 'images']);
    }
}
