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
        // Migrate existing data to JSON format with 'id' locale first (slug stays string)
        DB::table('categories')->get()->each(function ($category) {
            DB::table('categories')->where('id', $category->id)->update([
                'name' => json_encode(['id' => $category->name]),
                'description' => $category->description
                    ? json_encode(['id' => $category->description])
                    : null,
                'meta_title' => $category->meta_title
                    ? json_encode(['id' => $category->meta_title])
                    : null,
                'meta_description' => $category->meta_description
                    ? json_encode(['id' => $category->meta_description])
                    : null,
            ]);
        });

        $driver = Schema::getConnection()->getDriverName();
        if (in_array($driver, ['mysql', 'mariadb'])) {
            DB::statement('ALTER TABLE categories MODIFY name JSON');
            DB::statement('ALTER TABLE categories MODIFY description JSON');
            DB::statement('ALTER TABLE categories MODIFY meta_title JSON');
            DB::statement('ALTER TABLE categories MODIFY meta_description JSON');
        } else if (in_array($driver, ['pgsql', 'postgres'])) {
            DB::statement('ALTER TABLE categories ALTER COLUMN name TYPE jsonb USING name::jsonb');
            DB::statement('ALTER TABLE categories ALTER COLUMN description TYPE jsonb USING description::jsonb');
            DB::statement('ALTER TABLE categories ALTER COLUMN meta_title TYPE jsonb USING meta_title::jsonb');
            DB::statement('ALTER TABLE categories ALTER COLUMN meta_description TYPE jsonb USING meta_description::jsonb');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Extract Indonesian values back to string columns
        DB::table('categories')->get()->each(function ($category) {
            $name = json_decode($category->name, true);
            $slug = json_decode($category->slug, true);
            $desc = json_decode($category->description, true);
            $metaTitle = json_decode($category->meta_title, true);
            $metaDesc = json_decode($category->meta_description, true);

            DB::table('categories')->where('id', $category->id)->update([
                'name' => $name['id'] ?? '',
                'slug' => $slug['id'] ?? '',
                'description' => $desc['id'] ?? null,
                'meta_title' => $metaTitle['id'] ?? null,
                'meta_description' => $metaDesc['id'] ?? null,
            ]);
        });

        Schema::table('categories', function (Blueprint $table) {
            $table->string('name')->change();
            $table->string('slug')->change();
            $table->text('description')->nullable()->change();
            $table->string('meta_title')->nullable()->change();
            $table->text('meta_description')->nullable()->change();
        });
    }
};
