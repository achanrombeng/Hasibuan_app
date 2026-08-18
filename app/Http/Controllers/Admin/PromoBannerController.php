<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Actions\PromoBanner\CreatePromoBannerAction;
use App\Actions\PromoBanner\DeletePromoBannerAction;
use App\Actions\PromoBanner\UpdatePromoBannerAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PromoBannerStoreRequest;
use App\Http\Requests\Admin\PromoBannerUpdateRequest;
use App\Http\Resources\PromoBannerResource;
use App\Models\PromoBanner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class PromoBannerController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('permission:manage settings'),
        ];
    }

    public function index(): Response
    {
        $promoBanners = PromoBanner::query()
            ->ordered()
            ->latest()
            ->get();

        return Inertia::render('Admin/PromoBanners/Index', [
            'promoBanners' => PromoBannerResource::collection($promoBanners)->resolve(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/PromoBanners/Create');
    }

    public function store(PromoBannerStoreRequest $request, CreatePromoBannerAction $action): RedirectResponse
    {
        $action->execute($request->validated());

        return redirect()
            ->route('admin.promo-banners.index')
            ->with('success', __('messages.promo_banner_created'));
    }

    public function edit(PromoBanner $promoBanner): Response
    {
        return Inertia::render('Admin/PromoBanners/Edit', [
            'promoBanner' => (new PromoBannerResource($promoBanner))->resolve(),
        ]);
    }

    public function update(
        PromoBannerUpdateRequest $request,
        PromoBanner $promoBanner,
        UpdatePromoBannerAction $action
    ): RedirectResponse {
        $action->execute($promoBanner, $request->validated());

        return redirect()
            ->route('admin.promo-banners.index')
            ->with('success', __('messages.promo_banner_updated'));
    }

    public function destroy(PromoBanner $promoBanner, DeletePromoBannerAction $action): RedirectResponse
    {
        $action->execute($promoBanner);

        return redirect()
            ->route('admin.promo-banners.index')
            ->with('success', __('messages.promo_banner_deleted'));
    }

    public function toggleActive(PromoBanner $promoBanner): JsonResponse
    {
        $promoBanner->update([
            'is_active' => !$promoBanner->is_active,
        ]);

        return response()->json([
            'success' => true,
            'is_active' => $promoBanner->is_active,
            'message' => $promoBanner->is_active
                ? __('messages.promo_banner_activated')
                : __('messages.promo_banner_deactivated'),
        ]);
    }
}
