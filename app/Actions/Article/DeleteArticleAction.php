<?php

declare(strict_types=1);

namespace App\Actions\Article;

use App\Models\Article;
use Illuminate\Support\Facades\Storage;

class DeleteArticleAction
{
    public function execute(Article $article): bool
    {
        if ($article->featured_image) {
            Storage::disk('public')->delete($article->featured_image);
        }

        return $article->delete();
    }
}
