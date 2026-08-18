import { useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Search } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
    value: string;
    label: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
}

export function Combobox({
    options,
    value,
    onChange,
    placeholder = 'Pilih opsi...',
    searchPlaceholder = 'Cari...',
    emptyText = 'Tidak ditemukan.',
    className,
    disabled = false,
}: ComboboxProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const selectedLabel = options.find((opt) => opt.value === value)?.label;

    const filteredOptions = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return options;
        return options.filter((opt) =>
            opt.label.toLowerCase().includes(q),
        );
    }, [options, search]);

    const handleSelect = (optValue: string) => {
        onChange(optValue === value ? '' : optValue);
        setOpen(false);
        setSearch('');
    };

    return (
        <Popover
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) setSearch('');
            }}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className={cn(
                        'flex w-full items-center justify-between rounded-xl border border-terra-200 bg-sand-50 px-4 py-3 text-left text-sm text-terra-900 transition-all focus:border-wood focus:ring-2 focus:ring-wood/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
                        !selectedLabel && 'text-terra-400',
                        className,
                    )}
                >
                    <span className="truncate">
                        {selectedLabel || placeholder}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <div className="flex items-center border-b border-terra-100 px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-terra-400"
                        autoFocus
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-1">
                    {filteredOptions.length === 0 ? (
                        <div className="py-6 text-center text-sm text-terra-500">
                            {emptyText}
                        </div>
                    ) : (
                        filteredOptions.map((option) => (
                            <button
                                type="button"
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={cn(
                                    'relative flex w-full cursor-pointer items-center rounded-sm px-2 py-1.5 text-left text-sm outline-none transition-colors hover:bg-terra-50 focus:bg-terra-50',
                                    value === option.value && 'bg-terra-50',
                                )}
                            >
                                <Check
                                    className={cn(
                                        'mr-2 h-4 w-4',
                                        value === option.value
                                            ? 'opacity-100'
                                            : 'opacity-0',
                                    )}
                                />
                                {option.label}
                            </button>
                        ))
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
