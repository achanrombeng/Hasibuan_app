<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\Shipping\RajaOngkirService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ShippingController extends Controller
{
    protected RajaOngkirService $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function provinces(): JsonResponse
    {
        $provinces = $this->rajaOngkir->getProvinces();
        return response()->json($provinces);
    }

    public function search(Request $request): JsonResponse
    {
        $query = $request->query('search');
        if (!$query) {
            return response()->json([]);
        }
        
        $destinations = $this->rajaOngkir->searchDestination($query);
        return response()->json($destinations);
    }

    /**
     * Calculate shipping cost for multiple couriers
     * 
     * @param Request $request
     * @return JsonResponse Returns array of shipping options with cost, ETD, etc.
     */
    public function cost(Request $request): JsonResponse
    {
        $request->validate([
            'destination' => 'required|string',
            'weight' => 'required|integer|min:1',
            'courier' => 'nullable|string', // Optional, defaults to popular couriers
        ]);

        $costs = $this->rajaOngkir->getCost(
            $request->destination,
            $request->weight,
            $request->courier // Will use default if null
        );

        if ($costs === null) {
            return response()->json([
                'error' => 'Failed to fetch shipping costs',
                'message' => 'Gagal mengambil data ongkos kirim. Silakan coba lagi.',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'options' => $costs,
        ]);
    }
}
