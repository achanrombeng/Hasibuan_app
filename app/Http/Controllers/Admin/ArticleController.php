<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Article\CreateArticleAction;
use App\Actions\Article\DeleteArticleAction;
use App\Actions\Article\UpdateArticleAction;
use App\Enums\ArticleStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ArticleStoreRequest;
use App\Http\Requests\Admin\ArticleUpdateRequest;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
            new Middleware('can:view articles', only: ['index', 'show']),
            new Middleware('can:create articles', only: ['create', 'store']),
            new Middleware('can:edit articles', only: ['edit', 'update']),
            new Middleware('can:delete articles', only: ['destroy']),
        ];
    }

    public function index(Request $request): Response
    {
        $query = Article::query()
            ->latest('created_at');

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $articles = $query->paginate(15)->withQueryString();

        // Transform the data to match frontend expectations
        $articles->through(function ($article) {
            return [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'author' => $article->author,
                'status' => $article->status->value,
                'published_at' => $article->published_at?->toISOString(),
                'views' => $article->views,
                'created_at' => $article->created_at->toISOString(),
            ];
        });

        return Inertia::render('Admin/Articles/Index', [
            'articles' => $articles,
            'filters' => $request->only(['search', 'status']),
            'statuses' => collect(ArticleStatus::cases())->map(fn($status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ]),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Articles/Create', [
            'statuses' => collect(ArticleStatus::cases())->map(fn($status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ]),
        ]);
    }

    public function store(ArticleStoreRequest $request, CreateArticleAction $action): RedirectResponse
    {
        $data = $request->validated();
        $image = $request->file('featured_image');

        $action->execute($data, $image);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', __('messages.article_created'));
    }

    public function edit(Article $article): Response
    {
        return Inertia::render('Admin/Articles/Edit', [
            'article' => [
                'id' => $article->id,
                'title' => $article->title,
                'slug' => $article->slug,
                'excerpt' => $article->excerpt,
                'content' => $article->content,
                'featured_image' => $article->featured_image,
                'author' => $article->author,
                'author_id' => $article->author_id,
                'status' => $article->status->value,
                'tags' => $article->tags ?? [],
                'read_time' => $article->read_time,
                'published_at' => $article->published_at?->format('Y-m-d\TH:i'),
                'meta_title' => $article->meta_title,
                'meta_description' => $article->meta_description,
                'meta_keywords' => $article->meta_keywords,
            ],
            'statuses' => collect(ArticleStatus::cases())->map(fn($status) => [
                'value' => $status->value,
                'label' => $status->label(),
            ]),
        ]);
    }

    public function update(
        ArticleUpdateRequest $request,
        Article $article,
        UpdateArticleAction $action
    ): RedirectResponse {
        $data = $request->validated();
        $newImage = $request->file('featured_image');
        $removeImage = $request->boolean('remove_image');

        $action->execute($article, $data, $newImage, $removeImage);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', __('messages.article_updated'));
    }

    public function destroy(Article $article, DeleteArticleAction $action): RedirectResponse
    {
        $action->execute($article);

        return redirect()
            ->route('admin.articles.index')
            ->with('success', __('messages.article_deleted'));
    }
}
