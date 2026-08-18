<?php

declare(strict_types=1);

namespace App\Actions\PromoBanner;

use App\Models\PromoBanner;

class CreatePromoBannerAction
{
    /**
     * @param array<string, mixed> $data
     */
    public function execute(array $data): PromoBanner
    {
        /** @var PromoBanner $promoBanner */
        $promoBanner = PromoBanner::create($data);

        return $promoBanner;
    }
}
