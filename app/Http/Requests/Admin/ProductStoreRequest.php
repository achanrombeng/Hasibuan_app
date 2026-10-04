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

        if (is_string($this->linked_product_ids) && ! empty($this->linked_product_ids)) {
            $decoded = json_decode($this->linked_product_ids, true);
            if (is_array($decoded)) {
                $mergeData['linked_product_ids'] = $decoded;
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
            'linked_product_ids' => ['nullable', 'array'],
            'linked_product_ids.*' => ['integer', 'exists:products,id'],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'is_featured' => ['nullable'],
            'is_new_arrival' => ['nullable'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
            'primary_image_id' => ['nullable', 'integer', 'exists:product_images,id'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:20480'],
            'return_url' => ['nullable', 'string'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Category is required.',
            'category_id.exists' => 'Category not found.',
            'sku.required' => 'SKU is required.',
            'sku.unique' => 'SKU is already in use.',
            'name.required' => 'Product name is required.',
            'images.*.image' => 'The file must be an image.',
            'images.*.max' => 'The image size may not exceed 20MB.',
        ];
    }
}
