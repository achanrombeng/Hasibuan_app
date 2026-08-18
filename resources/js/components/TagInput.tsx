import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState, KeyboardEvent } from 'react';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export function TagInput({ value = [], onChange, placeholder = 'Tambah tag...', maxTags }: TagInputProps) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ',') && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue.trim());
        } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const addTag = (tag: string) => {
        if (tag && !value.includes(tag)) {
            if (!maxTags || value.length < maxTags) {
                onChange([...value, tag]);
                setInputValue('');
            }
        }
    };

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
            />
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="pl-2.5 pr-1">
                            {tag}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="ml-1 h-auto p-0.5 hover:bg-transparent"
                                onClick={() => removeTag(index)}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            )}
        </div>
    );
}
