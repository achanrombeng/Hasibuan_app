<?php

declare(strict_types=1);

namespace App\Actions\PromoBanner;

use App\Models\PromoBanner;

class DeletePromoBannerAction
{
    public function execute(PromoBanner $promoBanner): bool
    {
        return $promoBanner->delete();
    }
}
