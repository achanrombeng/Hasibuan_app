<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Actions\Product\GetRelatedProductsAction;
use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Services\Query\ProductQuery;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = ProductQuery::shop($request)
            ->paginate(12)
            ->withQueryString();

        $categories = Category::active()
            ->ordered()
            ->get();

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        } elseif ($request->filled('filter.category')) {
            $currentCategory = Category::where('slug', $request->input('filter.category'))->first();
        }

        return Inertia::render('Shop/Products/Index', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function show(Product $product, GetRelatedProductsAction $getRelatedProducts): Response
    {
        // Increment view count
        $product->incrementViewCount();

        $product->load([
            'category',
            'images',
            'reviews' => fn ($query) => $query->approved()->with('user')->latest()->limit(10),
        ]);

        $relatedProducts = $getRelatedProducts->execute($product);

        // Check if user has reviewed
        $userReview = null;
        if (auth()->check()) {
            $userReview = $product->reviews()
                ->where('user_id', auth()->id())
                ->first();
        }

        return Inertia::render('Shop/Products/Show', [
            'product' => (new ProductResource($product))->resolve(),
            'relatedProducts' => ProductResource::collection($relatedProducts)->resolve(),
            'userReview' => $userReview,
        ]);
    }

    public function byCategory(Category $category, Request $request): Response
    {
        $products = ProductQuery::shop($request)
            ->whereIn('category_id', $category->getDescendantIds())
            ->paginate(12)
            ->withQueryString();

        $categories = Category::active()
            ->root()
            ->with('children')
            ->ordered()
            ->get();

        return Inertia::render('Shop/Products/Index', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => new CategoryResource($category),
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function hotSale(Request $request): Response
    {
        $products = ProductQuery::shop($request)
            ->where('sale_type', 'hot_sale')
            ->paginate(12)
            ->withQueryString();

        $categories = Category::active()
            ->root()
            ->with('children')
            ->ordered()
            ->get();

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        }

        return Inertia::render('Shop/Sale/HotSale', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function clearance(Request $request): Response
    {
        $products = ProductQuery::shop($request)
            ->where('sale_type', 'clearance')
            ->paginate(12)
            ->withQueryString();

        $categories = Category::active()
            ->root()
            ->with('children')
            ->ordered()
            ->get();

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        }

        return Inertia::render('Shop/Sale/Clearance', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function stockSale(Request $request): Response
    {
        $products = ProductQuery::shop($request)
            ->where('sale_type', 'stock_sale')
            ->paginate(12)
            ->withQueryString();

        $categories = Category::active()
            ->root()
            ->with('children')
            ->ordered()
            ->get();

        $currentCategory = null;
        if ($request->filled('filter.category_id')) {
            $currentCategory = Category::find($request->input('filter.category_id'));
        }

        return Inertia::render('Shop/Sale/StockSale', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'currentCategory' => $currentCategory ? new CategoryResource($currentCategory) : null,
            'filters' => $request->only(['filter', 'sort']),
        ]);
    }

    public function compare(Request $request): Response
    {
        $ids = $request->query('ids', '');
        $productIds = array_filter(explode(',', $ids), fn ($id) => is_numeric($id));

        $products = Product::active()
            ->whereIn('id', $productIds)
            ->with(['category', 'images'])
            ->get();

        return Inertia::render('Shop/Compare', [
            'products' => ProductResource::collection($products),
        ]);
    }
}
