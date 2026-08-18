<?php

declare(strict_types=1);

namespace App\Services\Query;

use App\Models\Order;
use Illuminate\Http\Request;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class OrderQuery
{
    public static function admin(Request $request): QueryBuilder
    {
        return QueryBuilder::for(Order::class)
            ->allowedFilters([
                AllowedFilter::partial('order_number'),
                AllowedFilter::exact('status'),
                AllowedFilter::exact('payment_status'),
                AllowedFilter::scope('date_from', 'createdAfter'),
                AllowedFilter::scope('date_to', 'createdBefore'),
            ])
            ->allowedSorts(['order_number', 'total', 'created_at', 'status'])
            ->with(['user', 'items']);
    }
}
