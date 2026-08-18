<?php

namespace App\Services;

use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    protected GoogleTranslate $translator;
    protected int $delayMs;
    protected int $maxRetries;

    public function __construct()
    {
        $this->translator = new GoogleTranslate();
        $this->delayMs = config('translation.auto_translate.rate_limit.delay_ms', 100);
        $this->maxRetries = config('translation.auto_translate.rate_limit.max_retries', 3);
    }

    /**
     * Translate text from source locale to target locale.
     */
    public function translate(
        string $text,
        string $targetLocale,
        string $sourceLocale = 'id'
    ): string {
        if (empty($text)) {
            return $text;
        }

        // Check cache first
        $cacheKey = $this->getCacheKey($text, $sourceLocale, $targetLocale);

        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        // Attempt translation with retries
        $attempt = 0;
        $lastException = null;

        while ($attempt < $this->maxRetries) {
            try {
                $this->translator->setSource($sourceLocale);
                $this->translator->setTarget($targetLocale);

                $translated = $this->translator->translate($text);

                // Cache for 30 days
                Cache::put($cacheKey, $translated, now()->addDays(30));

                // Rate limiting delay
                if ($this->delayMs > 0) {
                    usleep($this->delayMs * 1000);
                }

                return $translated;
            } catch (\Exception $e) {
                $lastException = $e;
                $attempt++;

                if ($attempt < $this->maxRetries) {
                    // Exponential backoff
                    $backoffMs = $this->delayMs * pow(2, $attempt);
                    usleep($backoffMs * 1000);
                }
            }
        }

        // Log failure and return original text as fallback
        Log::error('Translation failed after retries', [
            'text' => substr($text, 0, 100),
            'source' => $sourceLocale,
            'target' => $targetLocale,
            'error' => $lastException?->getMessage()
        ]);

        return $text;
    }

    /**
     * Translate multiple texts at once.
     */
    public function translateBatch(
        array $texts,
        string $targetLocale,
        string $sourceLocale = 'id'
    ): array {
        $results = [];

        foreach ($texts as $key => $text) {
            $results[$key] = $this->translate($text, $targetLocale, $sourceLocale);
        }

        return $results;
    }

    /**
     * Generate cache key for translation.
     */
    protected function getCacheKey(string $text, string $source, string $target): string
    {
        return 'translation:' . md5($text . $source . $target);
    }

    /**
     * Clear translation cache.
     */
    public function clearCache(): void
    {
        Cache::flush();
    }
}
