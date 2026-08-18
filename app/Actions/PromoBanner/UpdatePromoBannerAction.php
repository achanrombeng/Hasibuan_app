<?php

declare(strict_types=1);

namespace App\Actions\PromoBanner;

use App\Models\PromoBanner;

class UpdatePromoBannerAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function execute(PromoBanner $promoBanner, array $data): PromoBanner
    {
        $promoBanner->update($data);

        return $promoBanner;
    }
}
