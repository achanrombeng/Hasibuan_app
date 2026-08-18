<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migrate existing data to JSON format with 'id' locale first
        DB::table('promo_banners')->get()->each(function ($banner) {
            DB::table('promo_banners')->where('id', $banner->id)->update([
                'title' => json_encode(['id' => $banner->title]),
                'description' => $banner->description
                    ? json_encode(['id' => $banner->description])
                    : null,
                'cta_text' => $banner->cta_text
                    ? json_encode(['id' => $banner->cta_text])
                    : null,
            ]);
        });

        $driver = Schema::getConnection()->getDriverName();
        if (in_array($driver, ['mysql', 'mariadb'])) {
            DB::statement('ALTER TABLE promo_banners MODIFY title JSON');
            DB::statement('ALTER TABLE promo_banners MODIFY description JSON');
            DB::statement('ALTER TABLE promo_banners MODIFY cta_text JSON');
        } else if (in_array($driver, ['pgsql', 'postgres'])) {
            DB::statement('ALTER TABLE promo_banners ALTER COLUMN title TYPE jsonb USING title::jsonb');
            DB::statement('ALTER TABLE promo_banners ALTER COLUMN description TYPE jsonb USING description::jsonb');
            DB::statement('ALTER TABLE promo_banners ALTER COLUMN cta_text DROP DEFAULT');
            DB::statement('ALTER TABLE promo_banners ALTER COLUMN cta_text TYPE jsonb USING cta_text::jsonb');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Extract Indonesian values back to string columns
        DB::table('promo_banners')->get()->each(function ($banner) {
            $title = json_decode($banner->title, true);
            $desc = json_decode($banner->description, true);
            $ctaText = json_decode($banner->cta_text, true);

            DB::table('promo_banners')->where('id', $banner->id)->update([
                'title' => $title['id'] ?? '',
                'description' => $desc['id'] ?? null,
                'cta_text' => $ctaText['id'] ?? null,
            ]);
        });

        Schema::table('promo_banners', function (Blueprint $table) {
            $table->string('title')->change();
            $table->text('description')->nullable()->change();
            $table->string('cta_text')->nullable()->change();
        });
    }
};
