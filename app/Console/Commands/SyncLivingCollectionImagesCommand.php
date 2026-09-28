<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Console\Command;

class SyncLivingCollectionImagesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'products:sync-living-collection-images';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync primary images from linked products into Living Collection products';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $livingCategory = Category::where('slug', 'living-collection')
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, '$.en'))) = 'living collection'")
            ->orWhereRaw("LOWER(JSON_UNQUOTE(JSON_EXTRACT(name, '$.id'))) = 'living collection'")
            ->first();

        if (! $livingCategory) {
            $this->error('Living Collection category not found.');

            return self::FAILURE;
        }

        $collections = Product::where('category_id', $livingCategory->id)
            ->with(['linkedProducts.images'])
            ->get();

        $this->info("Found {$collections->count()} products in Living Collection category.");

        $synced = 0;
        $drafted = 0;

        foreach ($collections as $collection) {
            $collection->syncLivingCollectionImages();
            $imageCount = $collection->images()->count();

            if ($imageCount > 0) {
                $this->line("  <info>✓</info> {$collection->name} => {$imageCount} primary images (ACTIVE)");
                $synced++;
            } else {
                $this->line("  <comment>-</comment> {$collection->name} => 0 images (DRAFT)");
                $drafted++;
            }
        }

        $this->newLine();
        $this->info("Sync completed: {$synced} collections active with images, {$drafted} collections in draft.");

        return self::SUCCESS;
    }
}
