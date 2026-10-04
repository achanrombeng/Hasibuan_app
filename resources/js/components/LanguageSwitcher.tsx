import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'toggle';
  className?: string;
}

export default function LanguageSwitcher({
  className = '',
}: LanguageSwitcherProps) {
  return (
    <div className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-neutral-700 ${className}`}>
      <Globe className="h-4 w-4 text-teal-600" />
      <span>EN</span>
    </div>
  );
}
