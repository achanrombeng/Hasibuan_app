<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Address Model
 *
 * Alamat pengiriman user.
 *
 * @property int $id
 * @property int $user_id
 * @property string $label
 * @property string $recipient_name
 * @property string $phone
 * @property string $address
 * @property string $city
 * @property string $province
 * @property string|null $city_id
 * @property string|null $province_id
 * @property string $postal_code
 * @property string|null $district
 * @property string|null $notes
 * @property bool $is_default
 */
class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'label',
        'recipient_name',
        'phone',
        'address',
        'city',
        'province',
        'postal_code',
        'district',
        'notes',
        'city_id',
        'province_id',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ==================== Scopes ====================

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    // ==================== Accessors ====================

    public function getFullAddressAttribute(): string
    {
        return implode(', ', array_filter([
            $this->address,
            $this->district,
            $this->city,
            $this->province,
            $this->postal_code,
        ]));
    }

    // ==================== Helper Methods ====================

    public function setAsDefault(): void
    {
        // Remove default from other addresses
        static::where('user_id', $this->user_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }
}
