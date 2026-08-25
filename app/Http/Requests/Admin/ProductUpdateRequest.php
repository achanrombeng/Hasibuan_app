<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\ProductStatus;
use App\Enums\SaleType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('edit products') ?? false;
    }

    protected function prepareForValidation(): void
    {
        $product = $this->route('product');
        if (is_numeric($product)) {
            $product = \App\Models\Product::find($product);
        }
        $currentPrice = is_object($product) ? $product->price : 0;
        $currentStock = is_object($product) ? $product->stock_quantity : 0;

        $mergeData = [];
        if ($this->price === null || $this->price === '') {
            $mergeData['price'] = $currentPrice;
        } else {
            $mergeData['price'] = (int) $this->price;
        }

        if ($this->stock_quantity === null || $this->stock_quantity === '') {
            $mergeData['stock_quantity'] = $currentStock;
        } else {
            $mergeData['stock_quantity'] = (int) $this->stock_quantity;
        }

        if (is_string($this->specifications) && ! empty($this->specifications)) {
            $decoded = json_decode($this->specifications, true);
            if (is_array($decoded)) {
                $mergeData['specifications'] = $decoded;
            }
        }

        if ($this->compare_price === '' || $this->compare_price === null) {
            $mergeData['compare_price'] = null;
        } else {
            $mergeData['compare_price'] = (int) $this->compare_price;
        }

        if ($this->cost_price === '' || $this->cost_price === null) {
            $mergeData['cost_price'] = null;
        } else {
            $mergeData['cost_price'] = (int) $this->cost_price;
        }

        if ($this->low_stock_threshold === '' || $this->low_stock_threshold === null) {
            $mergeData['low_stock_threshold'] = 0;
        }

        if ($this->shipping_class === '' || $this->shipping_class === null) {
            $mergeData['shipping_class'] = null;
        }

        if ($this->discount_percentage === '' || $this->discount_percentage === null) {
            $mergeData['discount_percentage'] = null;
        }

        if ($this->discount_starts_at === '' || $this->discount_starts_at === null) {
            $mergeData['discount_starts_at'] = null;
        }

        if ($this->discount_ends_at === '' || $this->discount_ends_at === null) {
            $mergeData['discount_ends_at'] = null;
        }

        $this->merge($mergeData);
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        $product = $this->route('product');
        $productId = is_object($product) ? $product->id : $product;

        return [
            'category_id' => ['required', 'exists:categories,id'],
            'sku' => ['required', 'string', 'max:50', Rule::unique('products')->ignore($productId)],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('products')->ignore($productId)],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'integer', 'min:0'],
            'compare_price' => ['nullable', 'integer', 'min:0'],
            'cost_price' => ['nullable', 'integer', 'min:0'],
            'stock_quantity' => ['nullable', 'integer', 'min:0'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
            'track_stock' => ['nullable'],
            'allow_backorder' => ['nullable'],
            'is_pre_order' => ['nullable'],
            'weight' => ['nullable', 'numeric', 'min:0'],
            'length' => ['nullable', 'numeric', 'min:0'],
            'width' => ['nullable', 'numeric', 'min:0'],
            'height' => ['nullable', 'numeric', 'min:0'],
            'shipping_class' => ['nullable', 'string', 'in:free_shipping,flat_rate,local_pickup'],
            'material' => ['nullable', 'string', 'max:500'],
            'color' => ['nullable', 'string', 'max:255'],
            'specifications' => ['nullable', 'array'],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'sale_type' => ['nullable', Rule::enum(SaleType::class)],
            'is_featured' => ['nullable'],
            'is_new_arrival' => ['nullable'],
            'discount_percentage' => ['nullable', 'integer', 'min:0', 'max:100'],
            'discount_starts_at' => ['nullable', 'date'],
            'discount_ends_at' => ['nullable', 'date', 'after:discount_starts_at'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'primary_image_id' => ['nullable', 'integer'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:2048'],
            'delete_images' => ['nullable', 'array'],
            'delete_images.*' => ['integer'],
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
