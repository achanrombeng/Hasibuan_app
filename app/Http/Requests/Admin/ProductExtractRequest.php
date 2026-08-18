<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProductExtractRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create products') ?? false;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'images' => ['required', 'array', 'min:1', 'max:5'],
            'images.*' => ['image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'context' => ['nullable', 'array'],
            'context.name' => ['nullable', 'string', 'max:255'],
            'context.category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'context.description' => ['nullable', 'string'],
            'context.short_description' => ['nullable', 'string', 'max:500'],
            'context.price' => ['nullable', 'numeric', 'min:0'],
            'context.compare_price' => ['nullable', 'numeric', 'min:0'],
            'context.cost_price' => ['nullable', 'numeric', 'min:0'],
            'context.weight' => ['nullable', 'numeric'],
            'context.length' => ['nullable', 'numeric'],
            'context.width' => ['nullable', 'numeric'],
            'context.height' => ['nullable', 'numeric'],
            'context.shipping_class' => ['nullable', 'string', 'in:free_shipping,flat_rate,local_pickup'],
            'context.stock_quantity' => ['nullable', 'integer', 'min:0'],
            'context.material' => ['nullable', 'string', 'max:100'],
            'context.color' => ['nullable', 'string', 'max:50'],
            'context.meta_title' => ['nullable', 'string', 'max:255'],
            'context.meta_description' => ['nullable', 'string', 'max:500'],
            'context.meta_keywords' => ['nullable', 'string', 'max:255'],
            'context.specifications' => ['nullable', 'array', 'max:10'],
            'context.specifications.*.key' => ['nullable', 'string', 'max:50'],
            'context.specifications.*.value' => ['nullable', 'string', 'max:60'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'images.required' => 'Gambar produk wajib diunggah terlebih dahulu.',
            'images.min' => 'Minimal satu gambar diperlukan.',
            'images.max' => 'Maksimal 5 gambar per analisis.',
            'images.*.image' => 'Semua file harus berupa gambar.',
            'images.*.mimes' => 'Format gambar harus JPG, PNG, atau WEBP.',
            'images.*.max' => 'Ukuran setiap gambar maksimal 4MB.',
        ];
    }
}
