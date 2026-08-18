<?php

declare(strict_types=1);

namespace App\Actions\Checkout;

use App\Models\Address;
use App\Models\User;

class ResolveShippingAddressAction
{
    /**
     * Resolve shipping address from request data.
     * Returns array suitable for Order creation.
     *
     * @param User $user
     * @param array $validated Request validated data
     * @return array
     */
    public function execute(User $user, array $validated): array
    {
        // Case 1: Use existing address
        if (isset($validated['address_id'])) {
            /** @var Address $address */
            $address = Address::findOrFail($validated['address_id']);
            return [
                'shipping_name' => $address->recipient_name,
                'shipping_phone' => $address->phone,
                'shipping_email' => $user->email,
                'shipping_address' => $address->full_address,
                'shipping_city' => $address->city,
                'shipping_province' => $address->province,
                'shipping_postal_code' => $address->postal_code,
                'payment_method' => $validated['payment_method'],
                'shipping_method' => $validated['shipping_method'],
                'customer_notes' => $validated['customer_notes'] ?? null,
                'coupon_code' => $validated['coupon_code'] ?? null,
            ];
        }

        // Case 2: Use new address provided in form
        $shippingData = [
            'shipping_name' => $validated['shipping_name'],
            'shipping_phone' => $validated['shipping_phone'],
            'shipping_email' => $validated['shipping_email'],
            'shipping_address' => $validated['shipping_address'],
            'shipping_city' => $validated['shipping_city'],
            'shipping_province' => $validated['shipping_province'],
            'shipping_postal_code' => $validated['shipping_postal_code'],
            'payment_method' => $validated['payment_method'],
            'shipping_method' => $validated['shipping_method'],
            'customer_notes' => $validated['customer_notes'] ?? null,
            'coupon_code' => $validated['coupon_code'] ?? null,
        ];

        // Optional: Save this new address to user's address book
        if (! empty($validated['save_address'])) {
            $user->addresses()->create([
                'label' => 'Alamat Baru',
                'recipient_name' => $validated['shipping_name'],
                'phone' => $validated['shipping_phone'],
                'address' => $validated['shipping_address'],
                'city' => $validated['shipping_city'],
                'province' => $validated['shipping_province'],
                'postal_code' => $validated['shipping_postal_code'],
            ]);
        }

        return $shippingData;
    }
}
