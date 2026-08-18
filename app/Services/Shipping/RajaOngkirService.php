<?php

namespace App\Services\Shipping;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class RajaOngkirService
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $origin;
    protected string $defaultCouriers;

    // Popular couriers for furniture shipping
    public const COURIER_JNE = 'jne';
    public const COURIER_SICEPAT = 'sicepat';
    public const COURIER_JNT = 'jnt';
    public const COURIER_ANTERAJA = 'anteraja';

    public function __construct()
    {
        $this->apiKey = config('rajaongkir.api_key');
        $this->baseUrl = config('rajaongkir.base_url');
        $this->origin = config('rajaongkir.origin');
        $this->defaultCouriers = config('rajaongkir.default_couriers', 'jne:sicepat:jnt:anteraja');
    }

    protected function makeRequest(string $method, string $endpoint, array $params = []): ?array
    {
        try {
            $response = Http::withHeaders([
                'key' => $this->apiKey,
            ])->$method("{$this->baseUrl}/{$endpoint}", $params);

            if ($response->failed()) {
                Log::error('RajaOngkir API Error', [
                    'endpoint' => $endpoint,
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);
                return null;
            }

            return $response->json()['data'] ?? null;
        } catch (\Exception $e) {
            Log::error('RajaOngkir Request Exception', [
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    public function getProvinces(): ?array
    {
        return $this->makeRequest('get', 'destination/province');
    }

    /**
     * Search destination using domestic-destination endpoint
     * Returns subdistrict data with IDs that can be used with getCost()
     */
    public function searchDestination(string $query): ?array
    {
        return $this->makeRequest('get', 'destination/domestic-destination', [
            'search' => $query,
            'limit' => 20
        ]);
    }

    /**
     * Get shipping cost using RajaOngkir Komerce API
     * 
     * Uses the /calculate/domestic-cost endpoint which accepts IDs from
     * the domestic-destination search endpoint
     * 
     * @param string $destination Destination ID from domestic-destination search
     * @param int $weight Weight in grams
     * @param string|null $courier Courier codes separated by colon (e.g., 'jne:sicepat:jnt')
     * @return array|null Array of courier options with costs, or null on error
     */
    public function getCost(string $destination, int $weight, ?string $courier = null): ?array
    {
        $courier = $courier ?? $this->defaultCouriers;

        $params = [
            'origin' => $this->origin,
            'destination' => $destination,
            'weight' => $weight,
            'courier' => $courier,
        ];

        try {
            // Using /calculate/domestic-cost endpoint (NOT district or subdistrict prefix)
            // This endpoint accepts IDs from domestic-destination search
            $response = Http::withHeaders([
                'key' => $this->apiKey,
                'Content-Type' => 'application/x-www-form-urlencoded',
            ])->asForm()->post("{$this->baseUrl}/calculate/domestic-cost", $params);

            if ($response->failed()) {
                Log::error('RajaOngkir Cost API Error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'params' => $params,
                ]);
                return null;
            }

            $data = $response->json()['data'] ?? null;
            
            if (!$data) {
                return null;
            }

            // Transform data to include all shipping options from all couriers
            return $this->transformCostResponse($data);
        } catch (\Exception $e) {
            Log::error('RajaOngkir Request Exception', [
                'message' => $e->getMessage(),
                'params' => $params,
            ]);
            return null;
        }
    }

    /**
     * Transform the raw RajaOngkir Komerce response into a flat array of shipping options
     * 
     * Komerce API returns a different format than classic RajaOngkir:
     * Each item is already a flat object with name, code, service, cost, etd
     * 
     * @param array $data Raw response data from RajaOngkir Komerce
     * @return array Flat array of shipping options
     */
    protected function transformCostResponse(array $data): array
    {
        $options = [];

        foreach ($data as $item) {
            // Komerce API returns flat structure per service
            $options[] = [
                'courier_code' => strtolower($item['code'] ?? ''),
                'courier_name' => $item['name'] ?? '',
                'service' => $item['service'] ?? '',
                'description' => $item['description'] ?? '',
                'cost' => $item['cost'] ?? 0,
                'etd' => $item['etd'] ?? '-',
                'key' => strtolower(($item['code'] ?? '') . '_' . ($item['service'] ?? '')),
            ];
        }

        // Sort by cost (cheapest first)
        usort($options, fn($a, $b) => $a['cost'] <=> $b['cost']);

        return $options;
    }

    /**
     * Get origin ID (for reference/debugging)
     */
    public function getOrigin(): string
    {
        return $this->origin;
    }
}
