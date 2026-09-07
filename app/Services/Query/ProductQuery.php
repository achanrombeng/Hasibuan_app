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
                AllowedFilter::callback('name', function ($query, $value) {
                    $val = '%' . mb_strtolower(trim((string) $value), 'UTF-8') . '%';
                    $query->where(function ($q) use ($val) {
                        $q->whereRaw('LOWER(name) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(sku) LIKE ?', [$val]);
                    });
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $val = '%' . mb_strtolower(trim((string) $value), 'UTF-8') . '%';
                    $query->where(function ($q) use ($val) {
                        $q->whereRaw('LOWER(name) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(sku) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(description) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(short_description) LIKE ?', [$val]);
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
                AllowedFilter::callback('name', function ($query, $value) {
                    $val = '%' . mb_strtolower(trim((string) $value), 'UTF-8') . '%';
                    $query->where(function ($q) use ($val) {
                        $q->whereRaw('LOWER(name) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(sku) LIKE ?', [$val]);
                    });
                }),
                AllowedFilter::callback('search', function ($query, $value) {
                    $val = '%' . mb_strtolower(trim((string) $value), 'UTF-8') . '%';
                    $query->where(function ($q) use ($val) {
                        $q->whereRaw('LOWER(name) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(sku) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(description) LIKE ?', [$val])
                            ->orWhereRaw('LOWER(short_description) LIKE ?', [$val]);
                    });
                }),
                AllowedFilter::callback('sku', function ($query, $value) {
                    $val = '%' . mb_strtolower(trim((string) $value), 'UTF-8') . '%';
                    $query->whereRaw('LOWER(sku) LIKE ?', [$val]);
                }),
                AllowedFilter::exact('category_id'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('is_featured'),
            ])
            ->allowedSorts(['name', 'sku', 'created_at', 'sold_count'])
            ->with(['category', 'images']);
    }
}
