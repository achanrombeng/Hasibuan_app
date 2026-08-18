<?php

declare(strict_types=1);

namespace App\Http\Requests\Shop;

use App\Enums\PaymentMethod;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            // Shipping address
            'address_id' => ['nullable', 'exists:addresses,id'],
            'shipping_name' => ['required_without:address_id', 'string', 'max:255'],
            'shipping_phone' => ['required_without:address_id', 'string', 'max:20'],
            'shipping_email' => ['required_without:address_id', 'email', 'max:255'],
            'shipping_address' => ['required_without:address_id', 'string', 'max:500'],
            'shipping_city' => ['required_without:address_id', 'string', 'max:100'],
            'shipping_province' => ['required_without:address_id', 'string', 'max:100'],
            'shipping_postal_code' => ['required_without:address_id', 'string', 'max:10'],

            // Payment
            'payment_method' => ['required', Rule::enum(PaymentMethod::class)],

            // Shipping
            'shipping_method' => ['required', 'string', 'max:100'],
            'shipping_cost' => ['required', 'integer', 'min:0'],

            // Optional
            'customer_notes' => ['nullable', 'string', 'max:500'],
            'coupon_code' => ['nullable', 'string', 'max:50'],
            'save_address' => ['boolean'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'shipping_name.required_without' => 'Nama penerima wajib diisi.',
            'shipping_phone.required_without' => 'Nomor telepon wajib diisi.',
            'shipping_email.required_without' => 'Email wajib diisi.',
            'shipping_email.email' => 'Format email tidak valid.',
            'shipping_address.required_without' => 'Alamat wajib diisi.',
            'shipping_city.required_without' => 'Kota wajib diisi.',
            'shipping_province.required_without' => 'Provinsi wajib diisi.',
            'shipping_postal_code.required_without' => 'Kode pos wajib diisi.',
            'payment_method.required' => 'Metode pembayaran wajib dipilih.',
            'payment_method.enum' => 'Metode pembayaran tidak valid.',
            'shipping_method.required' => 'Metode pengiriman wajib dipilih.',
            'shipping_cost.required' => 'Ongkos kirim wajib dipilih.',
            'customer_notes.max' => 'Catatan maksimal 500 karakter.',
        ];
    }
}
