<?php

namespace App\Actions\Translation;

use App\Services\TranslationService;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\Translatable\HasTranslations;

class AutoTranslateModel
{
    public function __construct(
        protected TranslationService $translationService
    ) {}

    /**
     * Auto-translate a model's translatable fields to the target locale.
     *
     * @param Model&HasTranslations $model
     * @param string $targetLocale
     * @param string $sourceLocale
     * @return Model&HasTranslations
     */
    public function execute(
        Model $model,
        string $targetLocale = 'en',
        string $sourceLocale = 'id'
    ): Model {
        if (!method_exists($model, 'getTranslatableAttributes')) {
            throw new \InvalidArgumentException('Model must use HasTranslations trait');
        }

        $translatableFields = $model->getTranslatableAttributes();

        foreach ($translatableFields as $field) {
            // Skip if translation already exists
            if ($model->hasTranslation($field, $targetLocale)) {
                continue;
            }

            // Get source value
            $sourceValue = $model->getTranslation($field, $sourceLocale, false);

            // Skip if source is empty/null
            if (empty($sourceValue)) {
                continue;
            }

            // Special handling for slug field
            if ($field === 'slug') {
                // Generate slug from translated name
                $nameField = 'name';
                if (in_array($nameField, $translatableFields)) {
                    $translatedName = $this->translateText($model->getTranslation($nameField, $sourceLocale), $targetLocale, $sourceLocale);
                    $translatedSlug = Str::slug($translatedName);
                    $model->setTranslation($field, $targetLocale, $translatedSlug);
                }
                continue;
            }

            // Translate the text
            $translatedValue = $this->translateText($sourceValue, $targetLocale, $sourceLocale);
            $model->setTranslation($field, $targetLocale, $translatedValue);
        }

        $model->save();

        return $model;
    }

    /**
     * Translate text, handling HTML content if present.
     */
    protected function translateText(string $text, string $targetLocale, string $sourceLocale): string
    {
        // Check if text contains HTML
        if ($text !== strip_tags($text)) {
            // For HTML content, we'll translate as-is
            // The translation service should handle this gracefully
            return $this->translationService->translate($text, $targetLocale, $sourceLocale);
        }

        return $this->translationService->translate($text, $targetLocale, $sourceLocale);
    }
}
