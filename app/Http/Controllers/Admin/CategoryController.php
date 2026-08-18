<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Category\CreateCategoryAction;
use App\Actions\Category\DeleteCategoryAction;
use App\Actions\Category\UpdateCategoryAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryStoreRequest;
use App\Http\Requests\Admin\CategoryUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view categories', only: ['index', 'show']),
            new Middleware('permission:create categories', only: ['create', 'store']),
            new Middleware('permission:edit categories', only: ['edit', 'update']),
            new Middleware('permission:delete categories', only: ['destroy']),
        ];
    }

    public function index(): Response
    {
        // Get only root categories (no parent) with their children eager loaded
        $categories = Category::whereNull('parent_id')
            ->with(['children' => function ($query) {
                $query->withCount('products')->orderBy('sort_order');
            }])
            ->withCount('products')
            ->orderBy('sort_order')
            ->get();

        // Manually map to ensure children are properly included
        $mappedCategories = $categories->map(function ($category) {
            // Calculate total products count including children
            $childrenProductsCount = $category->children->sum('products_count');
            $totalProductsCount = $category->products_count + $childrenProductsCount;

            return [
                'id' => $category->id,
                'parent_id' => $category->parent_id,
                'name' => $category->name,
                'slug' => $category->slug,
                'description' => $category->description,
                'image_url' => $category->image_url,
                'is_active' => $category->is_active,
                'is_featured' => $category->is_featured,
                'sort_order' => $category->sort_order,
                'products_count' => $totalProductsCount,
                'children' => $category->children->map(function ($child) {
                    return [
                        'id' => $child->id,
                        'parent_id' => $child->parent_id,
                        'name' => $child->name,
                        'slug' => $child->slug,
                        'description' => $child->description,
                        'image_url' => $child->image_url,
                        'is_active' => $child->is_active,
                        'is_featured' => $child->is_featured,
                        'sort_order' => $child->sort_order,
                        'products_count' => $child->products_count,
                        'children' => [],
                    ];
                })->toArray(),
                'created_at' => $category->created_at?->toISOString(),
            ];
        })->toArray();

        return Inertia::render('Admin/Categories/Index', [
            'categories' => ['data' => $mappedCategories],
        ]);
    }

    public function create(): Response
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => CategoryResource::collection($parentCategories)->resolve(),
        ]);
    }

    public function store(CategoryStoreRequest $request, CreateCategoryAction $action): RedirectResponse
    {
        $action->execute(
            $request->validated(),
            $request->file('image')
        );

        return redirect()
            ->route('admin.categories.index')
            ->with('success', __('messages.category_created'));
    }

    public function edit(Category $category): Response
    {
        $parentCategories = Category::whereNull('parent_id')
            ->where('id', '!=', $category->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Categories/Edit', [
            'category' => (new CategoryResource($category))->resolve(),
            'parentCategories' => CategoryResource::collection($parentCategories)->resolve(),
        ]);
    }

    public function update(
        CategoryUpdateRequest $request,
        Category $category,
        UpdateCategoryAction $action
    ): RedirectResponse {
        $action->execute(
            $category,
            $request->validated(),
            $request->file('image')
        );

        return redirect()
            ->route('admin.categories.index')
            ->with('success', __('messages.category_updated'));
    }

    public function destroy(Category $category, DeleteCategoryAction $action): RedirectResponse
    {
        try {
            $action->execute($category);

            return redirect()
                ->route('admin.categories.index')
                ->with('success', __('messages.category_deleted'));
        } catch (\InvalidArgumentException $e) {
            return redirect()
                ->route('admin.categories.index')
                ->with('error', $e->getMessage());
        }
    }
}
