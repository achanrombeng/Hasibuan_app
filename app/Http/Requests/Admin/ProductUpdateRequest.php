<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\ProductStatus;
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
        $mergeData = [];

        if (is_string($this->specifications) && ! empty($this->specifications)) {
            $decoded = json_decode($this->specifications, true);
            if (is_array($decoded)) {
                $mergeData['specifications'] = $decoded;
            }
        }

        if (is_string($this->linked_product_ids) && ! empty($this->linked_product_ids)) {
            $decoded = json_decode($this->linked_product_ids, true);
            if (is_array($decoded)) {
                $mergeData['linked_product_ids'] = $decoded;
            }
        }

        if ($this->low_stock_threshold === '' || $this->low_stock_threshold === null) {
            $mergeData['low_stock_threshold'] = 0;
        }

        if ($this->shipping_class === '' || $this->shipping_class === null) {
            $mergeData['shipping_class'] = null;
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
            'linked_product_ids' => ['nullable', 'array'],
            'linked_product_ids.*' => ['integer', 'exists:products,id'],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'is_featured' => ['nullable'],
            'is_new_arrival' => ['nullable'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'primary_image_id' => ['nullable', 'integer'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:20480'],
            'delete_images' => ['nullable', 'array'],
            'delete_images.*' => ['integer'],
            'return_url' => ['nullable', 'string'],
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
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.max' => 'Ukuran file gambar maksimal 20MB.',
        ];
    }
}
