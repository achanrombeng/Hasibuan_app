import { cn } from '@/lib/utils';
import { SectionBgConfig } from '@/types/shop';
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  Home,
  Image as ImageIcon,
  Info,
  LayoutGrid,
  Mail,
  MessageSquare,
  Palette,
  Quote,
  RefreshCw,
  RotateCcw,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Upload,
  Users,
} from 'lucide-react';
import React, { useState } from 'react';

export interface HomepageSubSectionDef {
  key: string;
  name: string;
  category: string;
  description: string;
  defaultType: string;
  defaultBgColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const SUB_SECTIONS: HomepageSubSectionDef[] = [
  {
    key: 'hero',
    name: 'Hero Lookbook Banner',
    category: 'Header / Banner',
    description: 'Bagian paling atas dengan judul utama, deskripsi, dan tombol CTA lookbook',
    defaultType: 'Default (Lookbook Slider)',
    defaultBgColor: '#0a0a0a',
    icon: Home,
  },
  {
    key: 'trust',
    name: 'Trust Logos & Media',
    category: 'Social Proof',
    description: 'Logo media arsitektur ternama (Architectural Digest, Elle Decor, Vogue Living)',
    defaultType: 'Default (#fcfcfb)',
    defaultBgColor: '#fcfcfb',
    icon: Users,
  },
  {
    key: 'categories',
    name: 'Categories Gallery',
    category: 'Showcase',
    description: 'Galeri koleksi arsitektur (Monaco Suite, Dining, Living, Bar Sets)',
    defaultType: 'Default (#fcfcfb)',
    defaultBgColor: '#fcfcfb',
    icon: LayoutGrid,
  },
  {
    key: 'products',
    name: 'Featured Products Showcase',
    category: 'Catalog',
    description: 'Grid kartu produk museum & furnitur unggulan dengan harga',
    defaultType: 'Default (#ffffff)',
    defaultBgColor: '#ffffff',
    icon: ShoppingBag,
  },
  {
    key: 'manifesto',
    name: 'Architectural Manifesto',
    category: 'Brand Story',
    description: 'Kutipan filosofi Vitruvian ("Pieces that define space, not just furnish")',
    defaultType: 'Default (#f6f5f3)',
    defaultBgColor: '#f6f5f3',
    icon: Quote,
  },
  {
    key: 'values',
    name: 'Core Values & Commitments',
    category: 'Philosophy',
    description: '3 kartu pilar komitmen (Kayu Jati Blora, Anyaman Cirebon, Skala Arsitektural)',
    defaultType: 'Default (#f6f5f3)',
    defaultBgColor: '#f6f5f3',
    icon: Sparkles,
  },
  {
    key: 'interior_design',
    name: 'Interior Design Atelier',
    category: 'Services',
    description: 'Layanan konsultasi desain interior dan program trade arsitek',
    defaultType: 'Default (#161616)',
    defaultBgColor: '#161616',
    icon: SlidersHorizontal,
  },
  {
    key: 'craftsmanship',
    name: 'Material Provenance & Craftsmanship',
    category: 'Provenance',
    description: 'Detail keahlian anyaman tangan dan kayu jati Grade-A bersertifikat',
    defaultType: 'Default (#fcfcfb)',
    defaultBgColor: '#fcfcfb',
    icon: Sparkles,
  },
  {
    key: 'testimonials',
    name: 'Press Accolades & Testimonials',
    category: 'Social Proof',
    description: 'Kutipan ulasan eksklusif dari klien & media arsitektur',
    defaultType: 'Default (#ffffff)',
    defaultBgColor: '#ffffff',
    icon: MessageSquare,
  },
  {
    key: 'articles',
    name: 'Architectural Journal (Articles)',
    category: 'Journal',
    description: '3 kartu esai arsitektur dan berita terbaru dari Hasibuan Design',
    defaultType: 'Default (#fcfcfb)',
    defaultBgColor: '#fcfcfb',
    icon: BookOpen,
  },
];

const PRESET_COLORS = [
  { label: 'Vitruvian Cream', value: '#fcfcfb' },
  { label: 'Warm Sand', value: '#f6f5f3' },
  { label: 'Pure White', value: '#ffffff' },
  { label: 'Architectural Bone', value: '#f0ede6' },
  { label: 'Soft Stone', value: '#e7e5e4' },
  { label: 'Muted Concrete', value: '#d6d3d1' },
  { label: 'Deep Charcoal', value: '#262626' },
  { label: 'Obsidian Slate', value: '#171717' },
  { label: 'Jet Black', value: '#0a0a0a' },
  { label: 'Forest Moss', value: '#1e261f' },
  { label: 'Aged Teak Wood', value: '#281e18' },
  { label: 'Deep Terracotta', value: '#2c1810' },
];

interface SectionBackgroundsManagerProps {
  backgrounds: Record<string, SectionBgConfig>;
  onChange: (updated: Record<string, SectionBgConfig>) => void;
  onFileSelect: (sectionKey: string, file: File) => void;
  onFileRemove: (sectionKey: string) => void;
  filePreviews: Map<string, string>;
}

export const SectionBackgroundsManager: React.FC<SectionBackgroundsManagerProps> = ({
  backgrounds,
  onChange,
  onFileSelect,
  onFileRemove,
  filePreviews,
}) => {
  const [activeKey, setActiveKey] = useState<string>('hero');
  const [imageInputMode, setImageInputMode] = useState<Record<string, 'upload' | 'url'>>({});
  const [viewMode, setViewMode] = useState<'focused' | 'all'>('focused');

  const activeSection = SUB_SECTIONS.find((s) => s.key === activeKey) || SUB_SECTIONS[0];
  const activeConfig: SectionBgConfig = backgrounds[activeKey] || {
    type: 'default',
    color: activeSection.defaultBgColor,
    image: '',
    overlay: 40,
    text_theme: 'auto',
  };

  const updateConfig = (key: string, updates: Partial<SectionBgConfig>) => {
    const current = backgrounds[key] || {
      type: 'default',
      color: SUB_SECTIONS.find((s) => s.key === key)?.defaultBgColor || '#ffffff',
      image: '',
      overlay: 40,
      text_theme: 'auto',
    };
    onChange({
      ...backgrounds,
      [key]: {
        ...current,
        ...updates,
      },
    });
  };

  const resetSectionToDefault = (key: string) => {
    onFileRemove(key);
    const updated = { ...backgrounds };
    delete updated[key];
    onChange(updated);
  };

  const getSectionStatusBadge = (key: string) => {
    const cfg = backgrounds[key];
    if (!cfg || cfg.type === 'default') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-600">
          Default
        </span>
      );
    }
    if (cfg.type === 'color') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[10px] font-medium text-neutral-800 shadow-2xs">
          <span
            className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
            style={{ backgroundColor: cfg.color || '#ffffff' }}
          />
          {cfg.color}
        </span>
      );
    }
    if (cfg.type === 'image') {
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[10px] font-medium text-teal-700">
          <ImageIcon className="h-2.5 w-2.5" />
          Gambar {cfg.overlay ? `(${cfg.overlay}%)` : ''}
        </span>
      );
    }
    return null;
  };

  const renderSectionEditor = (section: HomepageSubSectionDef) => {
    const key = section.key;
    const config: SectionBgConfig = backgrounds[key] || {
      type: 'default',
      color: section.defaultBgColor,
      image: '',
      overlay: 40,
      text_theme: 'auto',
    };
    const currentMode = imageInputMode[key] || 'upload';
    const previewUrl = filePreviews.get(key) || config.image || '';

    return (
      <div key={key} className="space-y-6">
        {/* Type Switcher */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-2">
            Pilih Jenis Background Bagian
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => updateConfig(key, { type: 'default' })}
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all',
                config.type === 'default'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-sm ring-2 ring-teal-600/20'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
              )}
            >
              <RefreshCw className="h-5 w-5" />
              <div>
                <div className="font-semibold text-xs sm:text-sm">Bawaan Tema</div>
                <div className="text-[11px] text-neutral-500 mt-0.5 hidden sm:block">
                  {section.defaultType}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                updateConfig(key, {
                  type: 'color',
                  color: config.color || section.defaultBgColor,
                })
              }
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all',
                config.type === 'color'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-sm ring-2 ring-teal-600/20'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
              )}
            >
              <Palette className="h-5 w-5" />
              <div>
                <div className="font-semibold text-xs sm:text-sm">Warna Solid</div>
                <div className="text-[11px] text-neutral-500 mt-0.5 hidden sm:block">
                  Pilih warna / hex code
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                updateConfig(key, {
                  type: 'image',
                  overlay: config.overlay ?? 40,
                })
              }
              className={cn(
                'flex flex-col items-center justify-center gap-2 rounded-xl border p-4 text-center transition-all',
                config.type === 'image'
                  ? 'border-teal-600 bg-teal-50/70 text-teal-900 shadow-sm ring-2 ring-teal-600/20'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
              )}
            >
              <ImageIcon className="h-5 w-5" />
              <div>
                <div className="font-semibold text-xs sm:text-sm">Gambar Latar</div>
                <div className="text-[11px] text-neutral-500 mt-0.5 hidden sm:block">
                  Import upload / Link URL
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Panel for Solid Color */}
        {config.type === 'color' && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">
                  Pengaturan Warna Latar
                </h4>
                <p className="text-xs text-neutral-500">
                  Pilih palet kemewahan arsitektur atau masukkan kode HEX khusus.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-medium text-neutral-700 bg-white border border-neutral-200 px-2 py-1 rounded">
                  {config.color || section.defaultBgColor}
                </span>
                <input
                  type="color"
                  value={config.color || section.defaultBgColor}
                  onChange={(e) => updateConfig(key, { color: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded border border-neutral-300 bg-white p-0.5"
                />
              </div>
            </div>

            {/* Curated Color Palette */}
            <div>
              <span className="block text-[11px] font-medium uppercase tracking-wider text-neutral-500 mb-2">
                Palet Warna Rekomendasi Hasibuan Design:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((preset) => {
                  const isSelected =
                    (config.color || '').toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => updateConfig(key, { color: preset.value })}
                      className={cn(
                        'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all',
                        isSelected
                          ? 'border-neutral-900 bg-white shadow-xs font-semibold ring-1 ring-neutral-900'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
                      )}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: preset.value }}
                      />
                      <span>{preset.label}</span>
                      {isSelected && <Check className="h-3 w-3 text-neutral-900 ml-0.5" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom HEX Code Field */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Kode Warna HEX Kustom
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-mono">
                    #
                  </span>
                  <input
                    type="text"
                    value={(config.color || '').replace('#', '')}
                    onChange={(e) =>
                      updateConfig(key, {
                        color: e.target.value ? `#${e.target.value.replace('#', '')}` : '',
                      })
                    }
                    placeholder="e.g. 1a1a1a"
                    className="w-full rounded-lg border border-neutral-300 bg-white pl-7 pr-3 py-2 text-xs font-mono text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Text Theme Contrast */}
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Adaptasi Kontras Teks
                </label>
                <select
                  value={config.text_theme || 'auto'}
                  onChange={(e) =>
                    updateConfig(key, {
                      text_theme: e.target.value as 'auto' | 'light' | 'dark',
                    })
                  }
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                >
                  <option value="auto">Otomatis (Sesuai kecerahan background)</option>
                  <option value="light">Teks Terang / Putih (Cocok untuk background gelap)</option>
                  <option value="dark">Teks Gelap / Hitam (Cocok untuk background terang)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Panel for Custom Image */}
        {config.type === 'image' && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50/60 p-5 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-900">
                  Pengaturan Gambar Latar
                </h4>
                <p className="text-xs text-neutral-500">
                  Import gambar dari perangkat Anda atau masukkan URL gambar beresolusi tinggi.
                </p>
              </div>
              {previewUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onFileRemove(key);
                    updateConfig(key, { image: '' });
                  }}
                  className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Hapus Gambar
                </button>
              )}
            </div>

            {/* Input Mode Selector: Upload File or URL */}
            <div className="flex gap-2 border-b border-neutral-200 pb-3">
              <button
                type="button"
                onClick={() =>
                  setImageInputMode({ ...imageInputMode, [key]: 'upload' })
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  currentMode === 'upload'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100',
                )}
              >
                <Upload className="h-3.5 w-3.5 inline mr-1" />
                Upload File (Import Gambar)
              </button>
              <button
                type="button"
                onClick={() =>
                  setImageInputMode({ ...imageInputMode, [key]: 'url' })
                }
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  currentMode === 'url'
                    ? 'bg-neutral-900 text-white'
                    : 'bg-white border border-neutral-200 text-neutral-700 hover:bg-neutral-100',
                )}
              >
                <ImageIcon className="h-3.5 w-3.5 inline mr-1" />
                Link URL Gambar
              </button>
            </div>

            {/* Mode: File Upload */}
            {currentMode === 'upload' && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Import File Gambar dari Komputer
                </label>
                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-white p-6 transition-colors hover:border-teal-500 text-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        onFileSelect(key, file);
                      }
                    }}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-600 mb-3">
                    <Upload className="h-6 w-6" />
                  </div>
                  <p className="text-xs font-medium text-neutral-800">
                    Klik untuk pilih gambar atau seret file ke sini
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Mendukung JPG, PNG, WEBP, SVG (Maks. 15MB)
                  </p>
                </div>
              </div>
            )}

            {/* Mode: URL Input */}
            {currentMode === 'url' && (
              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  URL Gambar (https://...)
                </label>
                <input
                  type="text"
                  value={config.image || ''}
                  onChange={(e) => updateConfig(key, { image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
              </div>
            )}

            {/* Dark Overlay Opacity Slider */}
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-semibold text-neutral-800">
                    Lapisan Gelap (Dark Overlay)
                  </label>
                  <p className="text-[11px] text-neutral-500">
                    Meredupkan gambar latar agar teks & konten tetap terbaca jelas.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                  {config.overlay ?? 40}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={config.overlay ?? 40}
                onChange={(e) =>
                  updateConfig(key, { overlay: parseInt(e.target.value, 10) })
                }
                className="w-full cursor-pointer accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-neutral-400">
                <span>0% (Terang asli)</span>
                <span>40% (Seimbang/Rekomendasi)</span>
                <span>90% (Sangat Gelap)</span>
              </div>
            </div>

            {/* Text Theme Contrast */}
            <div className="pt-2">
              <label className="block text-xs font-medium text-neutral-700 mb-1">
                Warna Teks Bagian
              </label>
              <select
                value={config.text_theme || 'auto'}
                onChange={(e) =>
                  updateConfig(key, {
                    text_theme: e.target.value as 'auto' | 'light' | 'dark',
                  })
                }
                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              >
                <option value="auto">
                  Otomatis (Teks putih jika overlay ≥ 30%)
                </option>
                <option value="light">
                  Teks Terang / Putih (Sangat direkomendasikan untuk foto)
                </option>
                <option value="dark">
                  Teks Gelap / Hitam (Hanya jika foto sangat cerah & tanpa overlay)
                </option>
              </select>
            </div>
          </div>
        )}

        {/* Live Mini Preview */}
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-neutral-700 flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5 text-neutral-500" />
              Live Preview Latar Bagian: {section.name}
            </span>
            <span className="text-[10px] text-neutral-400">
              {config.type === 'default'
                ? 'Tampilan Bawaan Tema'
                : config.type === 'color'
                  ? `Warna: ${config.color || section.defaultBgColor}`
                  : `Foto dengan Overlay ${config.overlay ?? 40}%`}
            </span>
          </div>

          <div
            className="relative overflow-hidden rounded-lg border border-neutral-200 p-8 text-center transition-all min-h-[140px] flex flex-col items-center justify-center"
            style={{
              backgroundColor:
                config.type === 'color'
                  ? config.color || section.defaultBgColor
                  : config.type === 'default'
                    ? section.defaultBgColor
                    : '#111111',
              backgroundImage:
                config.type === 'image' && previewUrl
                  ? `url("${previewUrl}")`
                  : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Overlay if image */}
            {config.type === 'image' && (
              <div
                className="absolute inset-0 pointer-events-none transition-opacity"
                style={{
                  backgroundColor: '#000000',
                  opacity: (config.overlay ?? 40) / 100,
                }}
              />
            )}

            {/* Dummy content representing the section */}
            <div className="relative z-10 space-y-2 max-w-md">
              <span
                className={cn(
                  'text-[10px] tracking-[0.25em] uppercase font-light',
                  config.text_theme === 'light' ||
                    (config.type === 'image' && (config.overlay ?? 40) >= 30) ||
                    (config.type === 'color' && config.color && ['#0a0a0a', '#171717', '#262626', '#161616', '#1e261f', '#281e18'].includes(config.color)) ||
                    (config.type === 'default' && ['#0a0a0a', '#161616'].includes(section.defaultBgColor))
                    ? 'text-neutral-300'
                    : 'text-neutral-500',
                )}
              >
                {section.category}
              </span>
              <h5
                className={cn(
                  'font-serif text-lg sm:text-xl font-light tracking-[0.06em] uppercase',
                  config.text_theme === 'light' ||
                    (config.type === 'image' && (config.overlay ?? 40) >= 30) ||
                    (config.type === 'color' && config.color && ['#0a0a0a', '#171717', '#262626', '#161616', '#1e261f', '#281e18'].includes(config.color)) ||
                    (config.type === 'default' && ['#0a0a0a', '#161616'].includes(section.defaultBgColor))
                    ? 'text-white'
                    : 'text-neutral-900',
                )}
              >
                {section.name}
              </h5>
              <p
                className={cn(
                  'text-xs font-light line-clamp-1',
                  config.text_theme === 'light' ||
                    (config.type === 'image' && (config.overlay ?? 40) >= 30) ||
                    (config.type === 'color' && config.color && ['#0a0a0a', '#171717', '#262626', '#161616', '#1e261f', '#281e18'].includes(config.color)) ||
                    (config.type === 'default' && ['#0a0a0a', '#161616'].includes(section.defaultBgColor))
                    ? 'text-neutral-300'
                    : 'text-neutral-600',
                )}
              >
                {section.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
            <Palette className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-900">
                Pilihan Background Setiap Sub Bagian Home
              </h2>
              <span className="rounded-full bg-teal-100/80 px-2.5 py-0.5 text-[10px] font-semibold text-teal-800">
                10 Sub-Bagian
              </span>
            </div>
            <p className="text-sm text-neutral-500">
              Kustomisasi warna solid atau import gambar latar belakang secara independen untuk tiap bagian homepage
            </p>
          </div>
        </div>

        {/* View Switcher: Tabs vs All */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'focused' ? 'all' : 'focused')}
            className="rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
          >
            {viewMode === 'focused' ? 'Tampilkan Semua Bagian' : 'Tampilan Tab Fokus'}
          </button>
        </div>
      </div>

      {/* Mode 1: Focused Tab View (Clean, elegant, non-overwhelming) */}
      {viewMode === 'focused' && (
        <div className="space-y-6">
          {/* Sub-section Navigation Pills */}
          <div className="flex flex-wrap gap-2 border-b border-neutral-100 pb-4">
            {SUB_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isSelected = sec.key === activeKey;
              return (
                <button
                  key={sec.key}
                  type="button"
                  onClick={() => setActiveKey(sec.key)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all text-left',
                    isSelected
                      ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                      : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50',
                  )}
                >
                  <Icon className={cn('h-3.5 w-3.5 shrink-0', isSelected ? 'text-white' : 'text-neutral-500')} />
                  <span>{sec.name}</span>
                  <span className="ml-1 shrink-0">
                    {isSelected ? (
                      <span className="rounded-full bg-white/20 px-1.5 py-0.2 text-[9px] font-mono">
                        Aktif
                      </span>
                    ) : (
                      getSectionStatusBadge(sec.key)
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active Section Info Card */}
          <div className="flex items-start justify-between rounded-xl bg-neutral-50 border border-neutral-200/80 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {activeSection.category}
                </span>
                <h3 className="text-sm font-bold text-neutral-900">
                  {activeSection.name}
                </h3>
              </div>
              <p className="text-xs text-neutral-500">
                {activeSection.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => resetSectionToDefault(activeKey)}
              className="text-xs text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1 font-medium px-2 py-1 rounded hover:bg-neutral-200/60 transition-colors shrink-0"
              title="Reset ke tampilan tema awal"
            >
              <RefreshCw className="h-3 w-3" /> Reset ke Bawaan
            </button>
          </div>

          {/* Active Section Editor */}
          {renderSectionEditor(activeSection)}
        </div>
      )}

      {/* Mode 2: All Sections Accordion / Grid View */}
      {viewMode === 'all' && (
        <div className="space-y-6">
          {SUB_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.key}
                className="rounded-xl border border-neutral-200 bg-white p-5 space-y-4 shadow-2xs"
              >
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">
                        {sec.name}
                      </h4>
                      <p className="text-xs text-neutral-500">
                        {sec.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSectionStatusBadge(sec.key)}
                    <button
                      type="button"
                      onClick={() => resetSectionToDefault(sec.key)}
                      className="text-[11px] text-neutral-400 hover:text-neutral-800"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {renderSectionEditor(sec)}
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Hint Footnote */}
      <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-neutral-200/80 bg-neutral-50/70 p-4 text-xs text-neutral-600">
        <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-neutral-800">Tips Pengaturan Background:</span>{' '}
          Ketika menggunakan foto beresolusi tinggi, pastikan mengaktifkan{' '}
          <strong className="text-neutral-900">Lapisan Gelap (Overlay) minimal 30%–50%</strong>{' '}
          dan memilih <strong className="text-neutral-900">Teks Terang / Putih</strong> agar tipografi kemewahan Hasibuan Design tetap terbaca tajam dan elegan.
        </div>
      </div>
    </div>
  );
};

export interface SingleSectionBackgroundControlProps {
  sectionKey: string;
  backgrounds: Record<string, SectionBgConfig>;
  onChange: (updated: Record<string, SectionBgConfig>) => void;
  onFileSelect: (sectionKey: string, file: File) => void;
  onFileRemove: (sectionKey: string) => void;
  filePreviews: Map<string, string>;
  title?: string;
  defaultExpanded?: boolean;
  className?: string;
}

export const SingleSectionBackgroundControl: React.FC<SingleSectionBackgroundControlProps> = ({
  sectionKey,
  backgrounds,
  onChange,
  onFileSelect,
  onFileRemove,
  filePreviews,
  title,
  defaultExpanded = true,
  className,
}) => {
  const sectionDef = SUB_SECTIONS.find((s) => s.key === sectionKey) || {
    key: sectionKey,
    name: title || sectionKey,
    category: 'Sub-Bagian',
    description: 'Pengaturan latar belakang sub-bagian',
    defaultType: 'Default',
    defaultBgColor: '#ffffff',
    icon: Palette,
  };

  const config: SectionBgConfig = backgrounds[sectionKey] || {
    type: 'default',
    color: sectionDef.defaultBgColor,
    image: '',
    overlay: 40,
    text_theme: 'auto',
  };

  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [imageInputMode, setImageInputMode] = useState<'upload' | 'url'>('upload');
  const previewUrl = filePreviews.get(sectionKey) || config.image || '';

  const updateConfig = (updates: Partial<SectionBgConfig>) => {
    onChange({
      ...backgrounds,
      [sectionKey]: {
        ...config,
        ...updates,
      },
    });
  };

  const resetToDefault = () => {
    onFileRemove(sectionKey);
    const updated = { ...backgrounds };
    delete updated[sectionKey];
    onChange(updated);
  };

  const isCustom = config.type && config.type !== 'default';

  return (
    <div
      className={cn(
        'rounded-xl border border-neutral-200/90 bg-neutral-50/40 p-4 sm:p-5 transition-all shadow-2xs',
        className,
      )}
    >
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 border border-teal-100/80">
            <Palette className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-neutral-900">
                Pengaturan Background Sub-Bagian
              </h4>
              {/* Status Badge */}
              {!isCustom ? (
                <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-600">
                  Bawaan Tema
                </span>
              ) : config.type === 'color' ? (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-2 py-0.5 text-[11px] font-medium text-neutral-800 shadow-2xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: config.color || sectionDef.defaultBgColor }}
                  />
                  Warna: {config.color || sectionDef.defaultBgColor}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 border border-teal-200 px-2 py-0.5 text-[11px] font-semibold text-teal-700">
                  <ImageIcon className="h-3 w-3" />
                  Gambar Latar ({config.overlay ?? 40}%)
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              Pilih warna solid atau gunakan foto latar khusus untuk sub-bagian ini
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isCustom && (
            <button
              type="button"
              onClick={resetToDefault}
              className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
              title="Kembalikan background ke bawaan tema"
            >
              <RotateCcw className="h-3 w-3" /> Reset Bawaan
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Sembunyikan Opsi
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> Atur Background
              </>
            )}
          </button>
        </div>
      </div>

      {/* Expanded Controls */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-neutral-200/70 space-y-5">
          {/* 3-Way Type Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Pilih Jenis Background
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => updateConfig({ type: 'default' })}
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                  config.type === 'default'
                    ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-600/20 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                    config.type === 'default'
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-100 text-neutral-600',
                  )}
                >
                  <RefreshCw className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs sm:text-sm">Bawaan Tema</div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    {sectionDef.defaultType}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  updateConfig({
                    type: 'color',
                    color: config.color || sectionDef.defaultBgColor,
                  })
                }
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                  config.type === 'color'
                    ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-600/20 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                    config.type === 'color'
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-100 text-neutral-600',
                  )}
                >
                  <Palette className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs sm:text-sm">Warna Solid</div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    Pilih warna / kode HEX
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() =>
                  updateConfig({
                    type: 'image',
                    overlay: config.overlay ?? 40,
                  })
                }
                className={cn(
                  'flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                  config.type === 'image'
                    ? 'border-teal-600 bg-teal-50/80 text-teal-950 ring-2 ring-teal-600/20 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-lg shrink-0',
                    config.type === 'image'
                      ? 'bg-teal-600 text-white'
                      : 'bg-neutral-100 text-neutral-600',
                  )}
                >
                  <ImageIcon className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-xs sm:text-sm">Gambar Latar</div>
                  <div className="text-[10px] text-neutral-500 truncate">
                    Upload foto / link URL
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Panel: Solid Color */}
          {config.type === 'color' && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4.5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                <div>
                  <h5 className="text-xs font-bold text-neutral-900">
                    Palet Warna Rekomendasi Hasibuan Design
                  </h5>
                  <p className="text-[11px] text-neutral-500">
                    Pilih tone netral arsitektur atau gunakan warna khusus.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-medium text-neutral-700 bg-neutral-50 border border-neutral-200 px-2 py-0.5 rounded">
                    {config.color || sectionDef.defaultBgColor}
                  </span>
                  <input
                    type="color"
                    value={config.color || sectionDef.defaultBgColor}
                    onChange={(e) => updateConfig({ color: e.target.value })}
                    className="h-7 w-7 cursor-pointer rounded border border-neutral-300 bg-white p-0.5"
                  />
                </div>
              </div>

              {/* Swatches */}
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((preset) => {
                  const isSelected =
                    (config.color || '').toLowerCase() === preset.value.toLowerCase();
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => updateConfig({ color: preset.value })}
                      className={cn(
                        'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all',
                        isSelected
                          ? 'border-neutral-900 bg-neutral-900 text-white font-medium shadow-xs'
                          : 'border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700',
                      )}
                    >
                      <span
                        className="h-3 w-3 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: preset.value }}
                      />
                      <span>{preset.label}</span>
                      {isSelected && <Check className="h-3 w-3 ml-0.5" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom HEX & Contrast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Kode Warna HEX Kustom
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400 text-xs font-mono">
                      #
                    </span>
                    <input
                      type="text"
                      value={(config.color || '').replace('#', '')}
                      onChange={(e) =>
                        updateConfig({
                          color: e.target.value
                            ? `#${e.target.value.replace('#', '')}`
                            : '',
                        })
                      }
                      placeholder="e.g. 1a1a1a"
                      className="w-full rounded-lg border border-neutral-300 bg-white pl-6 pr-3 py-1.5 text-xs font-mono text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Adaptasi Kontras Teks
                  </label>
                  <select
                    value={config.text_theme || 'auto'}
                    onChange={(e) =>
                      updateConfig({
                        text_theme: e.target.value as 'auto' | 'light' | 'dark',
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="auto">Otomatis (Berdasarkan warna background)</option>
                    <option value="light">Teks Terang / Putih (Background gelap)</option>
                    <option value="dark">Teks Gelap / Hitam (Background terang)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Panel: Image Background */}
          {config.type === 'image' && (
            <div className="rounded-xl border border-neutral-200 bg-white p-4.5 space-y-4 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 pb-3">
                <div>
                  <h5 className="text-xs font-bold text-neutral-900">
                    Upload atau Tautkan Foto Latar
                  </h5>
                  <p className="text-[11px] text-neutral-500">
                    Mendukung JPG, PNG, WEBP beresolusi tinggi (Maks. 15MB).
                  </p>
                </div>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      onFileRemove(sectionKey);
                      updateConfig({ image: '' });
                    }}
                    className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Hapus Gambar
                  </button>
                )}
              </div>

              {/* Upload vs URL Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageInputMode('upload')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    imageInputMode === 'upload'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                  )}
                >
                  <Upload className="h-3 w-3 inline mr-1" />
                  Upload File Gambar
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                    imageInputMode === 'url'
                      ? 'bg-neutral-900 text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200',
                  )}
                >
                  <ImageIcon className="h-3 w-3 inline mr-1" />
                  Link URL Gambar
                </button>
              </div>

              {imageInputMode === 'upload' ? (
                <div className="relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 bg-neutral-50/60 p-5 transition-colors hover:border-teal-500 text-center">
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) onFileSelect(sectionKey, file);
                    }}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-50 text-teal-600 mb-2">
                    <Upload className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold text-neutral-800">
                    Klik atau seret foto latar ke sini
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    JPG, PNG, WEBP (Maksimal 15MB)
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    URL Gambar (https://...)
                  </label>
                  <input
                    type="text"
                    value={config.image || ''}
                    onChange={(e) => updateConfig({ image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              )}

              {/* Overlay Slider & Text Contrast */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-100">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-semibold text-neutral-800">
                      Lapisan Gelap (Dark Overlay)
                    </label>
                    <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                      {config.overlay ?? 40}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="90"
                    step="5"
                    value={config.overlay ?? 40}
                    onChange={(e) =>
                      updateConfig({ overlay: parseInt(e.target.value, 10) })
                    }
                    className="w-full cursor-pointer accent-teal-600"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400">
                    <span>0% (Terang)</span>
                    <span>40% (Ideal)</span>
                    <span>90% (Gelap)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                    Warna Teks Kontras
                  </label>
                  <select
                    value={config.text_theme || 'auto'}
                    onChange={(e) =>
                      updateConfig({
                        text_theme: e.target.value as 'auto' | 'light' | 'dark',
                      })
                    }
                    className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-1.5 text-xs text-neutral-900 focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="auto">Otomatis (Teks putih jika overlay ≥ 30%)</option>
                    <option value="light">Teks Terang / Putih (Rekomendasi untuk foto)</option>
                    <option value="dark">Teks Gelap / Hitam (Jika foto cerah)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Mini Live Preview */}
          <div className="rounded-xl border border-neutral-200 bg-white p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-1.5">
                <Eye className="h-3 w-3 text-neutral-500" />
                Live Preview Latar: {sectionDef.name}
              </span>
              <span className="text-[10px] text-neutral-400">
                {config.type === 'default'
                  ? 'Bawaan Tema'
                  : config.type === 'color'
                    ? `Warna: ${config.color || sectionDef.defaultBgColor}`
                    : `Foto dengan Overlay ${config.overlay ?? 40}%`}
              </span>
            </div>

            <div
              className="relative overflow-hidden rounded-lg border border-neutral-200/80 p-5 text-center transition-all min-h-[100px] flex flex-col items-center justify-center"
              style={{
                backgroundColor:
                  config.type === 'color'
                    ? config.color || sectionDef.defaultBgColor
                    : config.type === 'default'
                      ? sectionDef.defaultBgColor
                      : '#111111',
                backgroundImage:
                  config.type === 'image' && previewUrl
                    ? `url("${previewUrl}")`
                    : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              {config.type === 'image' && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity"
                  style={{
                    backgroundColor: '#000000',
                    opacity: (config.overlay ?? 40) / 100,
                  }}
                />
              )}

              <div className="relative z-10 space-y-1 max-w-sm">
                <span
                  className={cn(
                    'text-[9px] tracking-[0.2em] uppercase font-light',
                    config.text_theme === 'light' ||
                      (config.type === 'image' && (config.overlay ?? 40) >= 30) ||
                      (config.type === 'color' &&
                        config.color &&
                        ['#0a0a0a', '#171717', '#262626', '#161616', '#1e261f', '#281e18'].includes(
                          config.color,
                        )) ||
                      (config.type === 'default' &&
                        ['#0a0a0a', '#161616'].includes(sectionDef.defaultBgColor))
                      ? 'text-neutral-300'
                      : 'text-neutral-500',
                  )}
                >
                  {sectionDef.category}
                </span>
                <h5
                  className={cn(
                    'font-serif text-sm sm:text-base font-light tracking-[0.06em] uppercase',
                    config.text_theme === 'light' ||
                      (config.type === 'image' && (config.overlay ?? 40) >= 30) ||
                      (config.type === 'color' &&
                        config.color &&
                        ['#0a0a0a', '#171717', '#262626', '#161616', '#1e261f', '#281e18'].includes(
                          config.color,
                        )) ||
                      (config.type === 'default' &&
                        ['#0a0a0a', '#161616'].includes(sectionDef.defaultBgColor))
                      ? 'text-white'
                      : 'text-neutral-900',
                  )}
                >
                  {sectionDef.name}
                </h5>
                <p
                  className={cn(
                    'text-[10px] font-light line-clamp-1',
                    config.text_theme === 'light' ||
                      (config.type === 'image' && (config.overlay ?? 40) >= 30) ||
                      (config.type === 'color' &&
                        config.color &&
                        ['#0a0a0a', '#171717', '#262626', '#161616', '#1e261f', '#281e18'].includes(
                          config.color,
                        )) ||
                      (config.type === 'default' &&
                        ['#0a0a0a', '#161616'].includes(sectionDef.defaultBgColor))
                      ? 'text-neutral-300'
                      : 'text-neutral-600',
                  )}
                >
                  {sectionDef.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

