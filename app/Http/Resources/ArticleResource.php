<?php

declare(strict_types=1);

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Str;

class ArticleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'excerpt' => $this->excerpt,
            'excerpt_truncated' => Str::limit($this->excerpt, 150),
            'content' => $this->content,
            'featured_image' => $this->featured_image,
            'featured_image_url' => $this->featured_image
                ? asset('storage/' . $this->featured_image)
                : null,
            'author' => $this->author,
            'author_name' => $this->author?->name ?? $this->author,
            'status' => $this->status->value,
            'tags' => $this->tags ?? [],
            'read_time' => $this->read_time,
            'views' => $this->views,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'meta_keywords' => $this->meta_keywords,
            'published_at' => $this->published_at,
            'formatted_published_at' => $this->published_at?->format('d M Y'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
