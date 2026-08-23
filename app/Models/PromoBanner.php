<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Spatie\Translatable\HasTranslations;

/**
 * PromoBanner Model
 *
 * Promo banner yang ditampilkan di shop frontend.
 *
 * @property int $id
 * @property string $title
 * @property string|null $description
 * @property string $cta_text
 * @property string $cta_link
 * @property string $icon
 * @property string $bg_gradient
 * @property string $display_type
 * @property bool $is_active
 * @property int $priority
 * @property Carbon|null $starts_at
 * @property Carbon|null $ends_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class PromoBanner extends Model
{
    use HasFactory;
    use HasTranslations;

    public array $translatable = [
        'title',
        'description',
        'cta_text',
    ];

    /**
     * The "booted" method of the model.
     */
    protected static function booted(): void
    {
        static::saved(function () {
            Cache::forget('active_promo_banners.id');
            Cache::forget('active_promo_banners.en');
        });

        static::deleted(function () {
            Cache::forget('active_promo_banners.id');
            Cache::forget('active_promo_banners.en');
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'cta_text',
        'cta_link',
        'icon',
        'bg_gradient',
        'display_type',
        'is_active',
        'priority',
        'starts_at',
        'ends_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'priority' => 'integer',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
        ];
    }

    /**
     * Scope untuk promo banner yang aktif dan dalam periode waktu.
     *
     * @param  Builder<PromoBanner>  $query
     * @return Builder<PromoBanner>
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')
                    ->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('ends_at')
                    ->orWhere('ends_at', '>=', now());
            });
    }

    /**
     * Scope untuk promo dengan display type banner atau both.
     *
     * @param  Builder<PromoBanner>  $query
     * @return Builder<PromoBanner>
     */
    public function scopeForBanner(Builder $query): Builder
    {
        return $query->whereIn('display_type', ['banner', 'both']);
    }

    /**
     * Scope untuk promo dengan display type popup atau both.
     *
     * @param  Builder<PromoBanner>  $query
     * @return Builder<PromoBanner>
     */
    public function scopeForPopup(Builder $query): Builder
    {
        return $query->whereIn('display_type', ['popup', 'both']);
    }

    /**
     * Scope untuk ordering berdasarkan priority.
     *
     * @param  Builder<PromoBanner>  $query
     * @return Builder<PromoBanner>
     */
    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('priority', 'desc');
    }

    /**
     * Check if the promo is currently active within its time range.
     */
    public function isCurrentlyActive(): bool
    {
        if (! $this->is_active) {
            return false;
        }

        $now = now();

        if ($this->starts_at && $this->starts_at->gt($now)) {
            return false;
        }

        if ($this->ends_at && $this->ends_at->lt($now)) {
            return false;
        }

        return true;
    }

    /**
     * Get status label.
     */
    public function getStatusLabel(): string
    {
        if (! $this->is_active) {
            return 'Nonaktif';
        }

        $now = now();

        if ($this->starts_at && $this->starts_at->gt($now)) {
            return 'Terjadwal';
        }

        if ($this->ends_at && $this->ends_at->lt($now)) {
            return 'Berakhir';
        }

        return 'Aktif';
    }
}
