<?php

declare(strict_types=1);

namespace App\Services\Ai;

use App\Models\Setting;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class GeminiVisionService
{
    private string $apiKey;

    private string $model;

    private string $baseUrl;

    private int $timeout;

    public function __construct()
    {
        $dbKey = (string) Setting::get('gemini_api_key', '');
        $this->apiKey = $dbKey !== '' ? $dbKey : (string) config('services.gemini.api_key', '');

        $dbModel = (string) Setting::get('ai_model', '');
        $this->model = $dbModel !== '' ? $dbModel : (string) config('services.gemini.model', 'gemini-3.6-flash');

        $this->baseUrl = rtrim((string) config('services.gemini.base_url'), '/');
        $this->timeout = (int) config('services.gemini.timeout', 30);
    }

    /**
     * Send one or more images + prompt to Gemini and return parsed JSON.
     *
     * @param  array<int, UploadedFile>  $images  Ordered by priority; the first is treated as primary.
     * @param  array<string, mixed>  $jsonSchema
     * @return array<string, mixed>
     *
     * @throws RuntimeException when the API call fails or returns invalid JSON.
     */
    public function generateJsonFromImages(
        array $images,
        string $prompt,
        array $jsonSchema,
        ?string $model = null,
        float $temperature = 0.4,
    ): array {
        if ($this->apiKey === '') {
            throw new RuntimeException('API key Gemini belum dikonfigurasi. Masukkan GEMINI_API_KEY di Pengaturan AI atau .env');
        }

        if ($images === []) {
            throw new RuntimeException('Minimal satu gambar diperlukan.');
        }

        $activeModel = $model ?? $this->model;

        $parts = [['text' => $prompt]];
        foreach ($images as $image) {
            $parts[] = ['inline_data' => [
                'mime_type' => $image->getMimeType() ?: 'image/jpeg',
                'data' => base64_encode((string) file_get_contents($image->getRealPath())),
            ]];
        }

        $payload = [
            'contents' => [['parts' => $parts]],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'responseSchema' => $jsonSchema,
                'temperature' => $temperature,
            ],
        ];

        $url = "{$this->baseUrl}/models/{$activeModel}:generateContent";

        $response = Http::timeout($this->timeout)
            ->withQueryParameters(['key' => $this->apiKey])
            ->acceptJson()
            ->asJson()
            ->post($url, $payload);

        if (! $response->successful()) {
            $status = $response->status();
            $body = $response->json();
            $msg = data_get($body, 'error.message', '');

            Log::warning('Gemini vision request failed', [
                'status' => $status,
                'body' => $response->body(),
            ]);

            if ($status === 429) {
                throw new RuntimeException('Kuota atau rate limit Google Gemini API telah habis (Error 429). Silakan tunggu beberapa saat atau perbarui GEMINI_API_KEY di Pengaturan AI.');
            }

            if ($status === 400 || $status === 403 || str_contains(strtolower((string) $msg), 'key')) {
                throw new RuntimeException('API Key Gemini tidak valid atau kuota terlampaui. Periksa GEMINI_API_KEY di Pengaturan AI.');
            }

            throw new RuntimeException('Gagal menghubungi Gemini API (HTTP '.$status.'): '.($msg ?: 'Respons error dari server Google Gemini.'));
        }

        $text = data_get($response->json(), 'candidates.0.content.parts.0.text');

        if (! is_string($text) || $text === '') {
            throw new RuntimeException('Respons Gemini kosong atau tidak valid.');
        }

        $decoded = json_decode($text, true);

        if (! is_array($decoded)) {
            Log::warning('Gemini returned non-JSON payload', ['text' => $text]);
            throw new RuntimeException('Gemini mengembalikan data yang tidak dapat diproses.');
        }

        return $decoded;
    }
}
