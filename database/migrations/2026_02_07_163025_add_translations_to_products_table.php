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
        $driver = Schema::getConnection()->getDriverName();

        // Drop FULLTEXT index first (only exists on MySQL/MariaDB)
        if (in_array($driver, ['mysql', 'mariadb'])) {
            Schema::table('products', function (Blueprint $table) {
                $table->dropFullText('products_name_short_description_fulltext');
            });
        }

        // Migrate existing data to JSON format with 'id' locale first
        DB::table('products')->get()->each(function ($product) {
            DB::table('products')->where('id', $product->id)->update([
                'name' => json_encode(['id' => $product->name]),
                'short_description' => $product->short_description
                    ? json_encode(['id' => $product->short_description])
                    : null,
                'description' => $product->description
                    ? json_encode(['id' => $product->description])
                    : null,
                'meta_title' => $product->meta_title
                    ? json_encode(['id' => $product->meta_title])
                    : null,
                'meta_description' => $product->meta_description
                    ? json_encode(['id' => $product->meta_description])
                    : null,
                'material' => $product->material
                    ? json_encode(['id' => $product->material])
                    : null,
                'color' => $product->color
                    ? json_encode(['id' => $product->color])
                    : null,
            ]);
        });

        // Convert columns to JSON type (driver-specific syntax)
        if (in_array($driver, ['mysql', 'mariadb'])) {
            DB::statement('ALTER TABLE products MODIFY name JSON');
            DB::statement('ALTER TABLE products MODIFY short_description JSON');
            DB::statement('ALTER TABLE products MODIFY description JSON');
            DB::statement('ALTER TABLE products MODIFY meta_title JSON');
            DB::statement('ALTER TABLE products MODIFY meta_description JSON');
            DB::statement('ALTER TABLE products MODIFY material JSON');
            DB::statement('ALTER TABLE products MODIFY color JSON');
        } else if (in_array($driver, ['pgsql', 'postgres'])) {
            DB::statement('ALTER TABLE products ALTER COLUMN name TYPE jsonb USING name::jsonb');
            DB::statement('ALTER TABLE products ALTER COLUMN short_description TYPE jsonb USING short_description::jsonb');
            DB::statement('ALTER TABLE products ALTER COLUMN description TYPE jsonb USING description::jsonb');
            DB::statement('ALTER TABLE products ALTER COLUMN meta_title TYPE jsonb USING meta_title::jsonb');
            DB::statement('ALTER TABLE products ALTER COLUMN meta_description TYPE jsonb USING meta_description::jsonb');
            DB::statement('ALTER TABLE products ALTER COLUMN material TYPE jsonb USING material::jsonb');
            DB::statement('ALTER TABLE products ALTER COLUMN color TYPE jsonb USING color::jsonb');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Extract Indonesian values back to string columns
        DB::table('products')->get()->each(function ($product) {
            $name = json_decode($product->name, true);
            $slug = json_decode($product->slug, true);
            $shortDesc = json_decode($product->short_description, true);
            $desc = json_decode($product->description, true);
            $metaTitle = json_decode($product->meta_title, true);
            $metaDesc = json_decode($product->meta_description, true);
            $material = json_decode($product->material, true);
            $color = json_decode($product->color, true);

            DB::table('products')->where('id', $product->id)->update([
                'name' => $name['id'] ?? '',
                'slug' => $slug['id'] ?? '',
                'short_description' => $shortDesc['id'] ?? null,
                'description' => $desc['id'] ?? null,
                'meta_title' => $metaTitle['id'] ?? null,
                'meta_description' => $metaDesc['id'] ?? null,
                'material' => $material['id'] ?? null,
                'color' => $color['id'] ?? null,
            ]);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->string('name')->change();
            $table->string('slug')->change();
            $table->text('short_description')->nullable()->change();
            $table->longText('description')->nullable()->change();
            $table->string('meta_title')->nullable()->change();
            $table->text('meta_description')->nullable()->change();
            $table->string('material')->nullable()->change();
            $table->string('color')->nullable()->change();
        });

        if (in_array(Schema::getConnection()->getDriverName(), ['mysql', 'mariadb'])) {
            Schema::table('products', function (Blueprint $table) {
                $table->fullText(['name', 'short_description'], 'products_name_short_description_fulltext');
            });
        }
    }
};
