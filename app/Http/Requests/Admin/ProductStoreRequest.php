<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\ProductStatus;
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
        $mergeData = [];

        if (is_string($this->specifications) && ! empty($this->specifications)) {
            $decoded = json_decode($this->specifications, true);
            if (is_array($decoded)) {
                $mergeData['specifications'] = $decoded;
            }
        }

        if ($this->shipping_class === '' || $this->shipping_class === null) {
            $mergeData['shipping_class'] = null;
        }

        $this->merge($mergeData);
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
            'is_featured' => ['nullable'],
            'is_new_arrival' => ['nullable'],
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
            'images.*.image' => 'File harus berupa gambar.',
            'images.*.max' => 'Ukuran gambar maksimal 2MB.',
        ];
    }
}
