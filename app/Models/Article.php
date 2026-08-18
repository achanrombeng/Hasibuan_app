<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\ArticleStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'featured_image',
        'author',
        'author_id',
        'status',
        'tags',
        'read_time',
        'views',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'published_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'status' => ArticleStatus::class,
        'published_at' => 'datetime',
        'read_time' => 'integer',
        'views' => 'integer',
    ];

    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (empty($article->slug)) {
                $article->slug = static::generateUniqueSlug($article->title);
            }

            if ($article->status === ArticleStatus::PUBLISHED && empty($article->published_at)) {
                $article->published_at = now();
            }
        });

        static::updating(function (Article $article) {
            if ($article->isDirty('title') && empty($article->slug)) {
                $article->slug = static::generateUniqueSlug($article->title, $article->id);
            }

            if ($article->isDirty('status') && $article->status === ArticleStatus::PUBLISHED && empty($article->published_at)) {
                $article->published_at = now();
            }
        });
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', ArticleStatus::PUBLISHED)
            ->where('published_at', '<=', now());
    }

    public function scopeSearch($query, ?string $term)
    {
        if (empty($term)) {
            return $query;
        }

        return $query->where(function ($q) use ($term) {
            $q->where('title', 'like', "%{$term}%")
                ->orWhere('excerpt', 'like', "%{$term}%")
                ->orWhere('content', 'like', "%{$term}%");
        });
    }

    public function scopeByTag($query, string $tag)
    {
        return $query->whereJsonContains('tags', $tag);
    }

    public function getReadTimeAttribute(): int
    {
        if (isset($this->attributes['read_time']) && $this->attributes['read_time'] > 0) {
            return $this->attributes['read_time'];
        }

        $wordCount = str_word_count(strip_tags($this->content ?? ''));
        return (int) ceil($wordCount / 200);
    }

    public static function generateUniqueSlug(string $title, ?int $excludeId = null): string
    {
        $slug = Str::slug($title);
        $originalSlug = $slug;
        $count = 1;

        while (static::slugExists($slug, $excludeId)) {
            $slug = $originalSlug . '-' . $count;
            $count++;
        }

        return $slug;
    }

    protected static function slugExists(string $slug, ?int $excludeId = null): bool
    {
        $query = static::where('slug', $slug);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        return $query->exists();
    }
}
