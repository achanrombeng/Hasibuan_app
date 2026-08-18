<?php

namespace App\Console\Commands;

use App\Actions\Translation\AutoTranslateModel;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TranslateContentCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'translate:content {model?} {--locale=en}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Auto-translate database content to target locale';

    /**
     * Execute the console command.
     */
    public function handle(AutoTranslateModel $autoTranslate): int
    {
        $modelArg = $this->argument('model') ?? 'all';
        $locale = $this->option('locale');

        $models = $this->getModelsToTranslate($modelArg);

        if (empty($models)) {
            $this->error("Invalid model: {$modelArg}");
            $this->info("Valid options: products, categories, promo_banners, all");
            return self::FAILURE;
        }

        $this->info("Starting translation to {$locale}...");

        $totalTranslated = 0;
        $totalFailed = 0;

        foreach ($models as $modelName => $modelClass) {
            $this->info("\nTranslating {$modelName}...");

            $records = $modelClass::all();
            $bar = $this->output->createProgressBar($records->count());
            $bar->start();

            $translated = 0;
            $failed = 0;

            foreach ($records as $record) {
                try {
                    $autoTranslate->execute($record, $locale);
                    $translated++;
                } catch (\Exception $e) {
                    $failed++;
                    Log::error("Failed to translate {$modelName} ID {$record->id}", [
                        'error' => $e->getMessage()
                    ]);
                }
                $bar->advance();
            }

            $bar->finish();
            $this->newLine();

            $this->info("✓ Translated {$translated} {$modelName}" . ($failed > 0 ? " ({$failed} failed)" : ""));

            $totalTranslated += $translated;
            $totalFailed += $failed;
        }

        $this->newLine();
        $this->info("Translation complete!");
        $this->info("Total translated: {$totalTranslated}");
        if ($totalFailed > 0) {
            $this->warn("Total failed: {$totalFailed}");
        }

        return self::SUCCESS;
    }

    /**
     * Get the models to translate based on argument.
     */
    protected function getModelsToTranslate(string $arg): array
    {
        $allModels = [
            'products' => \App\Models\Product::class,
            'categories' => \App\Models\Category::class,
            'promo_banners' => \App\Models\PromoBanner::class,
        ];

        if ($arg === 'all') {
            return $allModels;
        }

        if (isset($allModels[$arg])) {
            return [$arg => $allModels[$arg]];
        }

        return [];
    }
}
