<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\Product\CreateProductAction;
use App\Actions\Product\DeleteProductAction;
use App\Actions\Product\ExtractProductFromImageAction;
use App\Actions\Product\UpdateProductAction;
use App\Enums\ProductStatus;
use App\Enums\SaleType;
use App\Exceptions\NonFurnitureImageException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductExtractRequest;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use App\Models\Product;
use App\Services\Query\ProductQuery;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;
use RuntimeException;

class ProductController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:view products', only: ['index', 'show']),
            new Middleware('permission:create products', only: ['create', 'store', 'extractFromImage']),
            new Middleware('permission:edit products', only: ['edit', 'update']),
            new Middleware('permission:delete products', only: ['destroy']),
        ];
    }

    public function index(Request $request): Response
    {
        $products = ProductQuery::admin($request)
            ->latest()
            ->paginate($request->input('per_page', 15))
            ->onEachSide(1)
            ->withQueryString();

        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products/Index', [
            'products' => ProductResource::collection($products),
            'categories' => CategoryResource::collection($categories),
            'filters' => $request->only(['filter', 'sort']),
            'statuses' => collect(ProductStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
            'saleTypes' => collect(SaleType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'name' => $type->label(),
            ])->all(),
        ]);
    }

    public function create(): Response
    {
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products/Create', [
            'categories' => CategoryResource::collection($categories)->resolve(),
            'statuses' => collect(ProductStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
            'saleTypes' => collect(SaleType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'name' => $type->label(),
            ])->all(),
        ]);
    }

    public function store(ProductStoreRequest $request, CreateProductAction $action): RedirectResponse
    {
        /** @var array<int, UploadedFile> $images */
        $images = $request->file('images') ?? [];

        // Ensure images is an array (could be associative from form)
        if (! empty($images)) {
            $images = array_values($images);
        }

        $action->execute($request->validated(), $images);

        return redirect()
            ->route('admin.products.index')
            ->with('success', __('messages.product_created'));
    }

    public function show(Product $product): Response
    {
        $product->load(['category', 'images', 'reviews.user']);

        return Inertia::render('Admin/Products/Show', [
            'product' => (new ProductResource($product))->resolve(),
        ]);
    }

    public function edit(Product $product): Response
    {
        $product->load(['category', 'images']);
        $categories = Category::where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Products/Edit', [
            'product' => (new ProductResource($product))->resolve(),
            'categories' => CategoryResource::collection($categories)->resolve(),
            'statuses' => collect(ProductStatus::cases())->map(fn ($status) => [
                'value' => $status->value,
                'name' => $status->label(),
            ])->all(),
            'saleTypes' => collect(SaleType::cases())->map(fn ($type) => [
                'value' => $type->value,
                'name' => $type->label(),
            ])->all(),
        ]);
    }

    public function update(
        ProductUpdateRequest $request,
        Product $product,
        UpdateProductAction $action
    ): RedirectResponse {
        /** @var array<int, UploadedFile> $newImages */
        $newImages = $request->file('images') ?? [];

        // Ensure images is an indexed array
        if (! empty($newImages)) {
            $newImages = array_values($newImages);
        }

        /** @var array<int, int> $deleteImageIds */
        $deleteImageIds = $request->input('delete_images', []);

        // Ensure delete_images is an array of integers
        if (! empty($deleteImageIds)) {
            $deleteImageIds = array_map('intval', array_values($deleteImageIds));
        }

        $action->execute($product, $request->validated(), $newImages, $deleteImageIds);

        return redirect()
            ->route('admin.products.index')
            ->with('success', __('messages.product_updated'));
    }

    public function destroy(Product $product, DeleteProductAction $action): RedirectResponse
    {
        $action->execute($product);

        return redirect()
            ->route('admin.products.index')
            ->with('success', __('messages.product_deleted'));
    }

    public function extractFromImage(
        ProductExtractRequest $request,
        ExtractProductFromImageAction $action,
    ): JsonResponse {
        /** @var array<int, UploadedFile> $images */
        $images = array_values((array) $request->file('images'));

        /** @var array<string, mixed> $context */
        $context = $request->validated('context', []);

        try {
            $data = $action->execute($images, $context);
        } catch (NonFurnitureImageException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        } catch (RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 502);
        }

        return response()->json(['data' => $data]);
    }
}
