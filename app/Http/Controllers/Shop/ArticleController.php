<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Resources\ArticleResource;
use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $query = Article::query()
            ->published()
            ->with('author:id,name')
            ->latest('published_at');

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('tag')) {
            $query->byTag($request->tag);
        }

        $articles = $query->paginate(9)->withQueryString();

        return Inertia::render('Shop/Articles/Index', [
            'articles' => ArticleResource::collection($articles),
            'filters' => $request->only(['search', 'tag']),
        ]);
    }

    public function show(string $slug): Response
    {
        $article = Article::query()
            ->where('slug', $slug)
            ->published()
            ->with('author:id,name')
            ->firstOrFail();

        $sessionKey = 'article_viewed_' . $article->id;
        if (!session()->has($sessionKey)) {
            $article->increment('views');
            session()->put($sessionKey, true);
        }

        return Inertia::render('Shop/Articles/Show', [
            'article' => new ArticleResource($article->fresh()),
        ]);
    }
}
