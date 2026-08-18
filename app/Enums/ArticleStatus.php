<?php

declare(strict_types=1);

namespace App\Enums;

enum ArticleStatus: string
{
    case DRAFT = 'draft';
    case PUBLISHED = 'published';
    case ARCHIVED = 'archived';

    public function label(): string
    {
        return __('enums.article_status.' . $this->value);
    }

    public function color(): string
    {
        return match ($this) {
            self::DRAFT => 'gray',
            self::PUBLISHED => 'green',
            self::ARCHIVED => 'yellow',
        };
    }

    public function isPublished(): bool
    {
        return $this === self::PUBLISHED;
    }
}
