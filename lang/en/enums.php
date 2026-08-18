<?php

return [
    'order_status' => [
        'pending' => 'Pending Confirmation',
        'confirmed' => 'Confirmed',
        'processing' => 'Processing',
        'shipped' => 'Shipped',
        'delivered' => 'Delivered',
        'cancelled' => 'Cancelled',
        'refunded' => 'Refunded',
    ],

    'payment_status' => [
        'pending' => 'Pending Payment',
        'paid' => 'Paid',
        'failed' => 'Failed',
        'expired' => 'Expired',
        'refunded' => 'Refunded',
    ],

    'payment_method' => [
        'bank_transfer' => 'Bank Transfer (Manual)',
        'cod' => 'Cash on Delivery (COD)',
        'midtrans' => 'Online Payment (Midtrans)',
        'whatsapp' => 'WhatsApp Order',
    ],

    'payment_method_description' => [
        'bank_transfer' => 'Transfer to BCA/Mandiri account, then upload payment proof.',
        'cod' => 'Pay when goods arrive (Additional fee Rp 5,000).',
        'midtrans' => 'Pay automatically via GoPay, OVO, ShopeePay, Credit Card, etc.',
        'whatsapp' => 'Order via WhatsApp and pay directly to admin.',
    ],

    'product_status' => [
        'draft' => 'Draft',
        'active' => 'Active',
        'inactive' => 'Inactive',
        'out_of_stock' => 'Out of Stock',
        'discontinued' => 'Discontinued',
    ],

    'sale_type' => [
        'regular' => 'Regular',
        'clearance' => 'Clearance Sale',
        'stock_sale' => 'Stock Sale',
        'custom' => 'Custom Order',
        'hot_sale' => 'Hot Sale',
    ],

    'article_status' => [
        'draft' => 'Draft',
        'published' => 'Published',
        'archived' => 'Archived',
    ],
];
