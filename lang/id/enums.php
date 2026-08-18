<?php

return [
    'order_status' => [
        'pending' => 'Menunggu Konfirmasi',
        'confirmed' => 'Dikonfirmasi',
        'processing' => 'Diproses',
        'shipped' => 'Dikirim',
        'delivered' => 'Selesai',
        'cancelled' => 'Dibatalkan',
        'refunded' => 'Dikembalikan',
    ],

    'payment_status' => [
        'pending' => 'Menunggu Pembayaran',
        'paid' => 'Lunas',
        'failed' => 'Gagal',
        'expired' => 'Kadaluarsa',
        'refunded' => 'Dikembalikan',
    ],

    'payment_method' => [
        'bank_transfer' => 'Transfer Bank (Manual)',
        'cod' => 'Cash on Delivery (COD)',
        'midtrans' => 'Online Payment (Midtrans)',
        'whatsapp' => 'WhatsApp Order',
    ],

    'payment_method_description' => [
        'bank_transfer' => 'Transfer ke rekening BCA/Mandiri, lalu upload bukti bayar.',
        'cod' => 'Bayar saat barang sampai (Biaya tambahan Rp 5.000).',
        'midtrans' => 'Bayar otomatis via GoPay, OVO, ShopeePay, Kartu Kredit, dll.',
        'whatsapp' => 'Pesan via WhatsApp dan bayar langsung ke admin.',
    ],

    'product_status' => [
        'draft' => 'Draft',
        'active' => 'Aktif',
        'inactive' => 'Nonaktif',
        'out_of_stock' => 'Stok Habis',
        'discontinued' => 'Dihentikan',
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
        'published' => 'Dipublikasi',
        'archived' => 'Diarsipkan',
    ],
];
