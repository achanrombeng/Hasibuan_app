<?php

declare(strict_types=1);

namespace App\Actions\Article;

use App\Enums\ArticleStatus;
use App\Models\Article;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class CreateArticleAction
{
    public function execute(array $data, ?UploadedFile $image = null): Article
    {
        if (empty($data['slug'])) {
            $data['slug'] = Article::generateUniqueSlug($data['title']);
        }

        if ($image) {
            $path = $image->store('articles', 'public');
            $data['featured_image'] = $path;
        }

        $wordCount = str_word_count(strip_tags($data['content'] ?? ''));
        $data['read_time'] = (int) ceil($wordCount / 200);

        if (
            isset($data['status']) &&
            $data['status'] === ArticleStatus::PUBLISHED->value &&
            empty($data['published_at'])
        ) {
            $data['published_at'] = now();
        }

        $article = Article::create($data);

        return $article->fresh();
    }
}
