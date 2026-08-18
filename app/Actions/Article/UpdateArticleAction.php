<?php

declare(strict_types=1);

namespace App\Actions\Article;

use App\Enums\ArticleStatus;
use App\Models\Article;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class UpdateArticleAction
{
    public function execute(
        Article $article,
        array $data,
        ?UploadedFile $newImage = null,
        bool $removeImage = false
    ): Article {
        if ($removeImage && $article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
            $data['featured_image'] = null;
        }

        if ($newImage) {
            if ($article->featured_image) {
                Storage::disk('public')->delete($article->featured_image);
            }
            $path = $newImage->store('articles', 'public');
            $data['featured_image'] = $path;
        }

        if (isset($data['content'])) {
            $wordCount = str_word_count(strip_tags($data['content']));
            $data['read_time'] = (int) ceil($wordCount / 200);
        }

        if (
            isset($data['status']) &&
            $data['status'] === ArticleStatus::PUBLISHED->value &&
            $article->status !== ArticleStatus::PUBLISHED &&
            empty($data['published_at'])
        ) {
            $data['published_at'] = now();
        }

        $article->update($data);

        return $article->fresh();
    }
}
