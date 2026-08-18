<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PromoBannerStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('manage settings') ?? false;
    }

    /** @return array<string, array<int, mixed>> */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:500'],
            'cta_text' => ['nullable', 'string', 'max:100'],
            'cta_link' => ['nullable', 'string', 'max:255'],
            'icon' => ['nullable', Rule::in(['gift', 'percent', 'truck'])],
            'bg_gradient' => ['nullable', 'string', 'max:100'],
            'display_type' => ['nullable', Rule::in(['banner', 'popup', 'both'])],
            'is_active' => ['boolean'],
            'priority' => ['nullable', 'integer', 'min:0', 'max:100'],
            'starts_at' => ['nullable', 'date'],
            'ends_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'title.required' => 'Judul promo wajib diisi.',
            'title.max' => 'Judul promo maksimal 255 karakter.',
            'description.max' => 'Deskripsi maksimal 500 karakter.',
            'ends_at.after_or_equal' => 'Tanggal berakhir harus setelah atau sama dengan tanggal mulai.',
        ];
    }
}
