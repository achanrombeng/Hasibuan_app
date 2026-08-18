<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\OrderStatus;
use App\Enums\PaymentStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrderUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('edit orders') ?? false;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'status' => ['sometimes', Rule::enum(OrderStatus::class)],
            'payment_status' => ['sometimes', Rule::enum(PaymentStatus::class)],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'admin_notes' => ['nullable', 'string', 'max:1000'],
            'shipping_method' => ['nullable', 'string', 'max:100'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'status.enum' => 'Status pesanan tidak valid.',
            'payment_status.enum' => 'Status pembayaran tidak valid.',
            'tracking_number.max' => 'Nomor resi maksimal 100 karakter.',
            'admin_notes.max' => 'Catatan admin maksimal 1000 karakter.',
        ];
    }
}
