<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create products') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'price' => ($this->price !== null && $this->price !== '') ? (int) $this->price : 0,
            'stock_quantity' => ($this->stock_quantity !== null && $this->stock_quantity !== '') ? (int) $this->stock_quantity : 0,
        ]);
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'sku' => ['required', 'string', 'max:50', 'unique:products,sku'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'integer', 'min:0'],
            'compare_price' => ['nullable', 'integer', 'min:0', 'gt:price'],
            'cost_price' => ['nullable', 'integer', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'track_stock' => ['boolean'],
            'allow_backorder' => ['boolean'],
            'is_pre_order' => ['boolean'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'shipping_class' => ['nullable', 'string', 'in:free_shipping,flat_rate,local_pickup'],
            'material' => ['nullable', 'string', 'max:100'],
            'color' => ['nullable', 'string', 'max:50'],
            'specifications' => ['nullable', 'array'],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'sale_type' => ['nullable', Rule::enum(SaleType::class)],
            'is_featured' => ['boolean'],
            'is_new_arrival' => ['boolean'],
            'discount_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'discount_starts_at' => ['nullable', 'date'],
            'discount_ends_at' => ['nullable', 'date', 'after:discount_starts_at'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'primary_image_id' => ['nullable', 'integer', 'exists:product_images,id'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:2048'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori wajib dipilih.',
            'category_id.exists' => 'Kategori tidak ditemukan.',
            'sku.required' => 'SKU wajib diisi.',
            'sku.unique' => 'SKU sudah digunakan.',
            'name.required' => 'Nama produk wajib diisi.',
            'price.required' => 'Harga wajib diisi.',
            'price.min' => 'Harga tidak boleh negatif.',
            'compare_price.gt' => 'Harga coret harus lebih besar dari harga jual.',
            'stock_quantity.required' => 'Stok wajib diisi.',
            'stock_quantity.min' => 'Stok tidak boleh negatif.',
            'discount_ends_at.after' => 'Tanggal akhir diskon harus setelah tanggal mulai.',
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.max' => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
