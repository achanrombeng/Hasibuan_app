<?php

declare(strict_types=1);

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Requests\Shop\AddressStoreRequest;
use App\Http\Resources\AddressResource;
use App\Models\Address;
use App\Models\User;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller implements HasMiddleware
{
    /** @return array<int, Middleware> */
    public static function middleware(): array
    {
        return [
            new Middleware('auth'),
        ];
    }

    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();

        $addresses = $user->addresses()->orderByDesc('is_default')->get();

        return Inertia::render('Shop/Addresses/Index', [
            'addresses' => AddressResource::collection($addresses),
        ]);
    }

    public function store(AddressStoreRequest $request): JsonResponse|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        $validated = $request->validated();

        // If this is set as default, unset other defaults
        if (! empty($validated['is_default'])) {
            $user->addresses()->update(['is_default' => false]);
        }

        $address = $user->addresses()->create($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Alamat berhasil ditambahkan.',
                'address' => new AddressResource($address),
            ]);
        }

        return redirect()
            ->route('shop.addresses.index')
            ->with('success', __('messages.address_created'));
    }

    public function update(AddressStoreRequest $request, Address $address): JsonResponse|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Ensure user can only update their own addresses
        if ($address->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke alamat ini.');
        }

        $validated = $request->validated();

        // If this is set as default, unset other defaults
        if (! empty($validated['is_default'])) {
            $user->addresses()->where('id', '!=', $address->id)->update(['is_default' => false]);
        }

        $address->update($validated);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Alamat berhasil diperbarui.',
                'address' => new AddressResource($address),
            ]);
        }

        return redirect()
            ->route('shop.addresses.index')
            ->with('success', __('messages.address_updated'));
    }

    public function destroy(Request $request, Address $address): JsonResponse|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Ensure user can only delete their own addresses
        if ($address->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke alamat ini.');
        }

        $address->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Alamat berhasil dihapus.',
            ]);
        }

        return redirect()
            ->route('shop.addresses.index')
            ->with('success', __('messages.address_deleted'));
    }

    public function setDefault(Request $request, Address $address): JsonResponse|RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();

        // Ensure user can only update their own addresses
        if ($address->user_id !== $user->id) {
            abort(403, 'Anda tidak memiliki akses ke alamat ini.');
        }

        // Unset other defaults
        $user->addresses()->update(['is_default' => false]);

        // Set this as default
        $address->update(['is_default' => true]);

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Alamat utama berhasil diubah.',
            ]);
        }

        return redirect()
            ->route('shop.addresses.index')
            ->with('success', __('messages.address_default_changed'));
    }
}
