<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\ArticleStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ArticleUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('edit articles');
    }

    public function rules(): array
    {
        $articleId = $this->route('article')->id ?? null;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('articles', 'slug')->ignore($articleId)],
            'excerpt' => ['required', 'string', 'max:500'],
            'content' => ['required', 'string'],
            'author' => ['required', 'string', 'max:100'],
            'author_id' => ['nullable', 'exists:users,id'],
            'status' => ['required', Rule::enum(ArticleStatus::class)],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'featured_image' => ['nullable', 'image', 'max:2048'],
            'existing_image' => ['nullable', 'string'],
            'remove_image' => ['nullable', 'boolean'],
            'published_at' => ['nullable', 'date'],
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:500'],
            'meta_keywords' => ['nullable', 'string', 'max:255'],
        ];
    }
}
