import { ConfirmDialog } from '@/components/ui/alert-dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import {
  PLATFORM_PRESETS,
  PlatformIcon,
  getPlatformBadgeStyle,
  type SocialItem,
} from '@/lib/social-platforms';
import { Head, useForm } from '@inertiajs/react';
import {
  ArrowDown,
  ArrowUp,
  Building2,
  Check,
  ChevronDown,
  ChevronUp,
  Columns,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Layers,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  PanelBottom,
  Phone,
  Plus,
  Save,
  ShieldCheck,
  Sparkles,
  Store,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface FooterLinkItem {
  label: string;
  url: string;
}

interface FooterSettingsProps {
  settings: {
    site_name: string;
    site_description: string;
    site_logo: string;
    footer_description: string;
    footer_tagline: string;
    footer_copyright: string;
    footer_show_newsletter: boolean;
    footer_newsletter_badge: string;
    footer_newsletter_title: string;
    footer_newsletter_subtitle: string;
    footer_col1_title: string;
    footer_col1_links: string;
    footer_col2_title: string;
    footer_col2_links: string;
    footer_col3_title: string;
    footer_col3_links: string;
    footer_col4_title: string;
    footer_col4_links: string;
    footer_contact_title: string;
    footer_show_factory: boolean;
    footer_show_showroom: boolean;
    footer_show_phone: boolean;
    footer_show_whatsapp: boolean;
    footer_show_email: boolean;
    footer_show_socials: boolean;
    footer_show_privacy: boolean;
    footer_privacy_url: string;
    footer_show_terms: boolean;
    footer_terms_url: string;
    footer_show_sitemap: boolean;
    footer_sitemap_url: string;
    footer_show_accessibility: boolean;
    footer_accessibility_text: string;
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    facebook_url: string;
    instagram_url: string;
    tiktok_url: string;
    youtube_url: string;
    linkedin_url?: string;
    social_links?: string;
  };
}

export default function FooterSettings({ settings }: FooterSettingsProps) {
  // Parse column links
  const safeParseLinks = (jsonString?: string): FooterLinkItem[] => {
    try {
      const parsed = JSON.parse(jsonString || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const [col1Links, setCol1Links] = useState<FooterLinkItem[]>(
    safeParseLinks(settings.footer_col1_links),
  );
  const [col2Links, setCol2Links] = useState<FooterLinkItem[]>(
    safeParseLinks(settings.footer_col2_links),
  );
  const [col3Links, setCol3Links] = useState<FooterLinkItem[]>(
    safeParseLinks(settings.footer_col3_links),
  );
  const [col4Links, setCol4Links] = useState<FooterLinkItem[]>(
    safeParseLinks(settings.footer_col4_links),
  );

  const [activeColTab, setActiveColTab] = useState<1 | 2 | 3 | 4>(1);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Parse initial social links
  const initialSocialLinks: SocialItem[] = (() => {
    const list: SocialItem[] = [];
    const seenPlatforms = new Set<string>();

    if (settings.social_links) {
      try {
        const parsed = JSON.parse(settings.social_links);
        if (Array.isArray(parsed) && parsed.length > 0) {
          parsed.forEach((item: any, idx: number) => {
            if (item && item.platform) {
              list.push({
                id: item.id || `social-${idx}-${Date.now()}`,
                platform: item.platform || 'instagram',
                url: item.url || '',
                label: item.label || '',
              });
              if (item.url && item.url.trim().length > 0) {
                seenPlatforms.add(item.platform.toLowerCase());
              }
            }
          });
        }
      } catch {
        // ignore
      }
    }

    const standalone: { id: string; platform: string; url?: string }[] = [
      { id: 'social-fb', platform: 'facebook', url: settings.facebook_url },
      { id: 'social-ig', platform: 'instagram', url: settings.instagram_url },
      { id: 'social-tt', platform: 'tiktok', url: settings.tiktok_url },
      { id: 'social-yt', platform: 'youtube', url: settings.youtube_url },
      { id: 'social-li', platform: 'linkedin', url: settings.linkedin_url },
    ];

    standalone.forEach(({ id, platform, url }) => {
      if (url && url.trim().length > 0 && !seenPlatforms.has(platform)) {
        list.push({ id, platform, url, label: '' });
        seenPlatforms.add(platform);
      }
    });

    return list.length > 0
      ? list
      : [
          { id: '1', platform: 'instagram', url: settings.instagram_url || '' },
          { id: '2', platform: 'facebook', url: settings.facebook_url || '' },
          { id: '3', platform: 'tiktok', url: settings.tiktok_url || '' },
          { id: '4', platform: 'linkedin', url: settings.linkedin_url || '' },
        ];
  })();

  const [socialItems, setSocialItems] = useState<SocialItem[]>(initialSocialLinks);

  const { data, setData, post, processing } = useForm({
    footer_description: settings.footer_description || '',
    footer_tagline:
      settings.footer_tagline ||
      'HASIBUAN DESIGN · THE CONTEMPORARY AND ART FINES FURNITURE',
    footer_copyright:
      settings.footer_copyright ||
      `© ${new Date().getFullYear()} HASIBUAN DESIGN. ALL RIGHTS RESERVED. ARCHITECTURAL & INTERIOR DESIGN DESIGNS PROTECTED.`,
    footer_show_newsletter: settings.footer_show_newsletter ?? true,
    footer_newsletter_badge: settings.footer_newsletter_badge || 'STAY CONNECTED',
    footer_newsletter_title: settings.footer_newsletter_title || 'BE THE FIRST TO KNOW',
    footer_newsletter_subtitle:
      settings.footer_newsletter_subtitle ||
      'Sign up to receive exclusive previews of new collections, seasonal source books, and private gallery events.',
    footer_col1_title: settings.footer_col1_title || 'GALLERIES & STUDIOS',
    footer_col1_links: settings.footer_col1_links || '[]',
    footer_col2_title: settings.footer_col2_title || 'DESIGN & ARCHITECTURE',
    footer_col2_links: settings.footer_col2_links || '[]',
    footer_col3_title: settings.footer_col3_title || 'CLIENT SERVICES',
    footer_col3_links: settings.footer_col3_links || '[]',
    footer_col4_title: settings.footer_col4_title || 'PHILOSOPHY & ETHOS',
    footer_col4_links: settings.footer_col4_links || '[]',
    footer_contact_title: settings.footer_contact_title || 'CONTACT & CONCIERGE',
    footer_show_factory: settings.footer_show_factory ?? false,
    footer_show_showroom: settings.footer_show_showroom ?? false,
    footer_show_phone: settings.footer_show_phone ?? false,
    footer_show_whatsapp: settings.footer_show_whatsapp ?? true,
    footer_show_email: settings.footer_show_email ?? false,
    footer_show_socials: settings.footer_show_socials ?? true,
    footer_show_privacy: settings.footer_show_privacy ?? true,
    footer_privacy_url: settings.footer_privacy_url || '/shop/privacy-policy',
    footer_show_terms: settings.footer_show_terms ?? true,
    footer_terms_url: settings.footer_terms_url || '/shop/terms',
    footer_show_sitemap: settings.footer_show_sitemap ?? true,
    footer_sitemap_url: settings.footer_sitemap_url || '/sitemap.xml',
    footer_show_accessibility: settings.footer_show_accessibility ?? true,
    footer_accessibility_text: settings.footer_accessibility_text || 'ACCESSIBILITY',
    social_links: JSON.stringify(initialSocialLinks),
    facebook_url: settings.facebook_url || '',
    instagram_url: settings.instagram_url || '',
    tiktok_url: settings.tiktok_url || '',
    youtube_url: settings.youtube_url || '',
    linkedin_url: settings.linkedin_url || '',
  });

  // Social item updater
  const updateSocialItems = (newItems: SocialItem[]) => {
    setSocialItems(newItems);

    let fb = '';
    let ig = '';
    let tt = '';
    let yt = '';
    let li = '';
    newItems.forEach((item) => {
      if (item.platform === 'facebook' && !fb) fb = item.url;
      if (item.platform === 'instagram' && !ig) ig = item.url;
      if (item.platform === 'tiktok' && !tt) tt = item.url;
      if (item.platform === 'youtube' && !yt) yt = item.url;
      if (item.platform === 'linkedin' && !li) li = item.url;
    });

    setData((prev) => ({
      ...prev,
      social_links: JSON.stringify(
        newItems
          .filter((i) => i.url.trim().length > 0)
          .map(({ platform, url, label }) => ({ platform, url, label })),
      ),
      facebook_url: fb,
      instagram_url: ig,
      tiktok_url: tt,
      youtube_url: yt,
      linkedin_url: li,
    }));
  };

  const handleAddSocial = (platform: string = 'instagram') => {
    const newItem: SocialItem = {
      id: `social-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      platform,
      url: '',
    };
    updateSocialItems([...socialItems, newItem]);
  };

  const handleRemoveSocial = (id: string) => {
    updateSocialItems(socialItems.filter((item) => item.id !== id));
  };

  const handleSocialChange = (
    id: string,
    field: 'platform' | 'url' | 'label',
    value: string,
  ) => {
    updateSocialItems(
      socialItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleMoveSocial = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= socialItems.length) return;
    const newItems = [...socialItems];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    updateSocialItems(newItems);
  };

  // Generic column link mutators
  const updateColumnLinks = (
    colNum: 1 | 2 | 3 | 4,
    links: FooterLinkItem[],
  ) => {
    const jsonStr = JSON.stringify(links);
    if (colNum === 1) {
      setCol1Links(links);
      setData('footer_col1_links', jsonStr);
    } else if (colNum === 2) {
      setCol2Links(links);
      setData('footer_col2_links', jsonStr);
    } else if (colNum === 3) {
      setCol3Links(links);
      setData('footer_col3_links', jsonStr);
    } else if (colNum === 4) {
      setCol4Links(links);
      setData('footer_col4_links', jsonStr);
    }
  };

  const handleLinkChange = (
    colNum: 1 | 2 | 3 | 4,
    index: number,
    field: 'label' | 'url',
    value: string,
  ) => {
    const sourceLinks =
      colNum === 1
        ? [...col1Links]
        : colNum === 2
          ? [...col2Links]
          : colNum === 3
            ? [...col3Links]
            : [...col4Links];
    sourceLinks[index][field] = value;
    updateColumnLinks(colNum, sourceLinks);
  };

  const addLink = (colNum: 1 | 2 | 3 | 4) => {
    const sourceLinks =
      colNum === 1
        ? [...col1Links]
        : colNum === 2
          ? [...col2Links]
          : colNum === 3
            ? [...col3Links]
            : [...col4Links];
    sourceLinks.push({ label: '', url: '' });
    updateColumnLinks(colNum, sourceLinks);
  };

  const removeLink = (colNum: 1 | 2 | 3 | 4, index: number) => {
    const sourceLinks =
      colNum === 1
        ? [...col1Links]
        : colNum === 2
          ? [...col2Links]
          : colNum === 3
            ? [...col3Links]
            : [...col4Links];
    const updated = sourceLinks.filter((_, i) => i !== index);
    updateColumnLinks(colNum, updated);
  };

  const moveLink = (
    colNum: 1 | 2 | 3 | 4,
    index: number,
    direction: 'up' | 'down',
  ) => {
    const sourceLinks =
      colNum === 1
        ? [...col1Links]
        : colNum === 2
          ? [...col2Links]
          : colNum === 3
            ? [...col3Links]
            : [...col4Links];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sourceLinks.length) return;
    const temp = sourceLinks[index];
    sourceLinks[index] = sourceLinks[targetIndex];
    sourceLinks[targetIndex] = temp;
    updateColumnLinks(colNum, sourceLinks);
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmSaveFooter = () => {
    post('/admin/settings/footer', {
      preserveScroll: true,
      onSuccess: () => {
        setShowConfirmDialog(false);
      },
      onError: () => {
        setShowConfirmDialog(false);
      },
    });
  };

  // Helper to render Column links editor
  const renderColumnEditor = (
    colNum: 1 | 2 | 3 | 4,
    titleField:
      | 'footer_col1_title'
      | 'footer_col2_title'
      | 'footer_col3_title'
      | 'footer_col4_title',
    links: FooterLinkItem[],
  ) => {
    return (
      <div className="space-y-4 pt-2">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
            Column {colNum} Title Header
          </label>
          <input
            type="text"
            value={data[titleField]}
            onChange={(e) => setData(titleField, e.target.value)}
            className="w-full max-w-md rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-900 shadow-sm focus:border-neutral-900 focus:outline-none"
            placeholder={`COLUMN ${colNum} TITLE`}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">
              Navigation Links ({links.length})
            </span>
            <button
              type="button"
              onClick={() => addLink(colNum)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-900 px-3.5 py-1.5 text-xs font-medium text-white transition-all hover:bg-neutral-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Link
            </button>
          </div>

          {links.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 py-8 text-center text-xs text-neutral-400">
              No links in Column {colNum} yet. Click &quot;Add Link&quot; above to insert items.
            </div>
          ) : (
            <div className="space-y-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50/80 p-3 sm:flex-row sm:items-center"
                >
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveLink(colNum, idx, 'up')}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-20"
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === links.length - 1}
                      onClick={() => moveLink(colNum, idx, 'down')}
                      className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-20"
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) =>
                        handleLinkChange(colNum, idx, 'label', e.target.value)
                      }
                      placeholder="Link Label (e.g. JEPARA CRAFT ATELIER)"
                      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs font-medium uppercase tracking-wider text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) =>
                        handleLinkChange(colNum, idx, 'url', e.target.value)
                      }
                      placeholder="URL Destination (e.g. /shop/about)"
                      className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeLink(colNum, idx)}
                    className="rounded-md p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:self-center"
                    title="Delete Link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout
      breadcrumbs={[
        { title: 'Settings', href: '/admin/settings' },
        { title: 'Store Footer Settings', href: '/admin/settings/footer' },
      ]}
    >
      <Head title="Store Footer Settings - Hasibuan Design" />

      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Storefront Footer Settings
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              Synchronize and configure the storefront footer: Newsletter strip, 4 architectural link columns, branding tagline, concierge options, social accounts, and legal links.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowLivePreview(!showLivePreview)}
            className="inline-flex items-center gap-2 self-start rounded-xl border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 shadow-sm transition-all hover:bg-neutral-50"
          >
            <Sparkles className="h-4 w-4 text-neutral-900" />
            {showLivePreview ? 'Hide Live Preview' : 'Show Live Preview'}
            {showLivePreview ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {/* 0. LIVE INTERACTIVE FOOTER PREVIEW CARD */}
        {showLivePreview && (
          <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-[#111111] text-white shadow-2xl transition-all">
            <div className="flex items-center justify-between border-b border-neutral-800/80 bg-neutral-900/60 px-5 py-3 text-xs tracking-wider text-neutral-400">
              <span className="flex items-center gap-2 font-medium text-white">
                <PanelBottom className="h-4 w-4 text-neutral-900" />
                LIVE PREVIEW · HASIBUAN STOREFRONT FOOTER
              </span>
              <span className="text-[10px] text-neutral-400">
                Synchronized with form changes below
              </span>
            </div>

            {/* Preview Newsletter */}
            {data.footer_show_newsletter && (
              <div className="border-b border-neutral-800/80 py-8 px-6 text-center space-y-3">
                <span className="text-[9px] tracking-[0.35em] uppercase text-neutral-400 font-light block">
                  {data.footer_newsletter_badge || 'STAY CONNECTED'}
                </span>
                <h4 className="font-serif text-lg md:text-xl font-light tracking-[0.08em] uppercase text-white">
                  {data.footer_newsletter_title || 'BE THE FIRST TO KNOW'}
                </h4>
                <p className="text-[11px] text-neutral-400 font-light max-w-md mx-auto">
                  {data.footer_newsletter_subtitle}
                </p>
                <div className="flex items-center justify-center gap-2 max-w-xs mx-auto pt-1">
                  <div className="flex-1 bg-neutral-900 border border-neutral-700 px-3 py-1.5 text-[10px] text-neutral-400 text-left uppercase tracking-wider">
                    ENTER EMAIL
                  </div>
                  <div className="bg-white text-black text-[10px] uppercase font-medium tracking-widest px-4 py-1.5">
                    JOIN
                  </div>
                </div>
              </div>
            )}

            {/* Preview 4 Columns */}
            <div className="py-8 px-6 sm:px-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[10px]">
                {/* Col 1 */}
                <div className="space-y-2">
                  <div className="tracking-[0.25em] uppercase text-white font-medium border-b border-neutral-800 pb-1.5">
                    {data.footer_col1_title}
                  </div>
                  <ul className="space-y-1.5 tracking-wider uppercase text-neutral-400 font-light">
                    {col1Links.map((l, i) => (
                      <li key={i} className="hover:text-white truncate">
                        {l.label || 'Link Label'}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 2 */}
                <div className="space-y-2">
                  <div className="tracking-[0.25em] uppercase text-white font-medium border-b border-neutral-800 pb-1.5">
                    {data.footer_col2_title}
                  </div>
                  <ul className="space-y-1.5 tracking-wider uppercase text-neutral-400 font-light">
                    {col2Links.map((l, i) => (
                      <li key={i} className="hover:text-white truncate">
                        {l.label || 'Link Label'}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Col 3 */}
                <div className="space-y-2">
                  <div className="tracking-[0.25em] uppercase text-white font-medium border-b border-neutral-800 pb-1.5">
                    {data.footer_col3_title}
                  </div>
                  <ul className="space-y-1.5 tracking-wider uppercase text-neutral-400 font-light">
                    {col3Links.map((l, i) => (
                      <li key={i} className="hover:text-white truncate">
                        {l.label || 'Link Label'}
                      </li>
                    ))}
                    {data.footer_show_whatsapp && (
                      <li className="text-emerald-400 truncate">
                        WA: {settings.contact_whatsapp || 'Active'}
                      </li>
                    )}
                    {data.footer_show_phone && (
                      <li className="text-neutral-300 truncate">
                        TEL: {settings.contact_phone || 'Active'}
                      </li>
                    )}
                    {data.footer_show_email && (
                      <li className="text-neutral-300 truncate">
                        EMAIL: {settings.contact_email || 'Active'}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Col 4 */}
                <div className="space-y-2">
                  <div className="tracking-[0.25em] uppercase text-white font-medium border-b border-neutral-800 pb-1.5">
                    {data.footer_col4_title}
                  </div>
                  <ul className="space-y-1.5 tracking-wider uppercase text-neutral-400 font-light">
                    {col4Links.map((l, i) => (
                      <li key={i} className="hover:text-white truncate">
                        {l.label || 'Link Label'}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Preview Bottom branding */}
            <div className="border-t border-neutral-800/80 py-6 px-6 text-center space-y-3">
              <div className="flex flex-col items-center">
                <img
                  src="/images/hasibuan-footer-logo.png"
                  alt="Hasibuan Designs"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-90 mb-1"
                />
                <span className="text-[8px] tracking-[0.4em] uppercase text-neutral-400 font-light">
                  {data.footer_tagline}
                </span>
              </div>

              {/* Social links */}
              {data.footer_show_socials && socialItems.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-4 text-[9px] tracking-[0.2em] uppercase text-neutral-400">
                  {socialItems
                    .filter((s) => s.url.trim().length > 0)
                    .map((s, idx) => (
                      <span key={idx} className="hover:text-white">
                        {(s.label || s.platform).toUpperCase()}
                      </span>
                    ))}
                </div>
              )}

              {/* Legal links */}
              <div className="flex flex-wrap items-center justify-center gap-3 text-[9px] tracking-widest uppercase text-neutral-500">
                {data.footer_show_privacy && <span>PRIVACY POLICY</span>}
                {data.footer_show_privacy && data.footer_show_terms && <span>·</span>}
                {data.footer_show_terms && <span>TERMS OF USE</span>}
                {data.footer_show_sitemap && <span>·</span>}
                {data.footer_show_sitemap && <span>SITE MAP</span>}
                {data.footer_show_accessibility && <span>·</span>}
                {data.footer_show_accessibility && (
                  <span>{data.footer_accessibility_text}</span>
                )}
              </div>

              <p className="text-[8px] tracking-wider uppercase text-neutral-600">
                {data.footer_copyright}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* SECTION 1: NEWSLETTER BANNER (STAY CONNECTED) */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <Mail className="h-5 w-5 text-neutral-800" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    1. Newsletter Strip (&quot;Stay Connected&quot;)
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Top subscription bar displayed right above footer columns
                  </p>
                </div>
              </div>

              {/* Show / Hide Toggle */}
              <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setData('footer_show_newsletter', true)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                    data.footer_show_newsletter
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Eye className="h-3.5 w-3.5" /> Show
                </button>
                <button
                  type="button"
                  onClick={() => setData('footer_show_newsletter', false)}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 font-medium transition-all ${
                    !data.footer_show_newsletter
                      ? 'bg-neutral-800 text-white shadow-sm'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <EyeOff className="h-3.5 w-3.5" /> Hide
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Badge Text (Top Subtitle)
                </label>
                <input
                  type="text"
                  value={data.footer_newsletter_badge}
                  onChange={(e) => setData('footer_newsletter_badge', e.target.value)}
                  placeholder="STAY CONNECTED"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm uppercase tracking-wider text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Main Title Header
                </label>
                <input
                  type="text"
                  value={data.footer_newsletter_title}
                  onChange={(e) => setData('footer_newsletter_title', e.target.value)}
                  placeholder="BE THE FIRST TO KNOW"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm uppercase tracking-wider text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Subtitle / Invitation Description
                </label>
                <textarea
                  rows={2}
                  value={data.footer_newsletter_subtitle}
                  onChange={(e) => setData('footer_newsletter_subtitle', e.target.value)}
                  placeholder="Sign up to receive exclusive previews of new collections, seasonal source books, and private gallery events."
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: 4 ARCHITECTURAL NAVIGATION COLUMNS */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                  <Columns className="h-5 w-5 text-neutral-800" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    2. Architectural Navigation (4 Columns)
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Manage titles and link lists for all 4 footer columns
                  </p>
                </div>
              </div>
            </div>

            {/* Column Selector Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-neutral-200 pb-4">
              {[
                { num: 1 as const, title: data.footer_col1_title, count: col1Links.length },
                { num: 2 as const, title: data.footer_col2_title, count: col2Links.length },
                { num: 3 as const, title: data.footer_col3_title, count: col3Links.length },
                { num: 4 as const, title: data.footer_col4_title, count: col4Links.length },
              ].map(({ num, title, count }) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setActiveColTab(num)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wider uppercase transition-all ${
                    activeColTab === num
                      ? 'bg-neutral-900 text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-900'
                  }`}
                >
                  <span>Col {num}: {title || `Column ${num}`}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      activeColTab === num
                        ? 'bg-neutral-700 text-neutral-200'
                        : 'bg-neutral-200 text-neutral-700'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              ))}
            </div>

            {/* Active Column Content */}
            <div className="mt-4">
              {activeColTab === 1 &&
                renderColumnEditor(1, 'footer_col1_title', col1Links)}
              {activeColTab === 2 &&
                renderColumnEditor(2, 'footer_col2_title', col2Links)}
              {activeColTab === 3 &&
                renderColumnEditor(3, 'footer_col3_title', col3Links)}
              {activeColTab === 4 &&
                renderColumnEditor(4, 'footer_col4_title', col4Links)}
            </div>
          </div>

          {/* SECTION 3: CONCIERGE & CONTACT INFORMATION DISPLAY */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <Store className="h-5 w-5 text-neutral-800" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  3. Concierge &amp; Contact Details Visibility
                </h2>
                <p className="text-sm text-neutral-500">
                  Toggle which contact details are visible under Client Services / Concierge
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Concierge Section Heading Title
                </label>
                <input
                  type="text"
                  value={data.footer_contact_title}
                  onChange={(e) => setData('footer_contact_title', e.target.value)}
                  placeholder="CONTACT & CONCIERGE"
                  className="w-full max-w-md rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-sm uppercase tracking-wider text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                {/* WhatsApp */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    data.footer_show_whatsapp
                      ? 'border-neutral-300 bg-white shadow-sm'
                      : 'border-dashed border-neutral-300 bg-neutral-50 opacity-70'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <MessageCircle className="h-4 w-4 text-emerald-600" />
                    WhatsApp
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_whatsapp', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_whatsapp
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_whatsapp', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_whatsapp
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>

                {/* Phone */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    data.footer_show_phone
                      ? 'border-neutral-300 bg-white shadow-sm'
                      : 'border-dashed border-neutral-300 bg-neutral-50 opacity-70'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Phone className="h-4 w-4 text-neutral-800" />
                    Telephone
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_phone', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_phone
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_phone', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_phone
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    data.footer_show_email
                      ? 'border-neutral-300 bg-white shadow-sm'
                      : 'border-dashed border-neutral-300 bg-neutral-50 opacity-70'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Mail className="h-4 w-4 text-neutral-800" />
                    Email
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_email', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_email
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_email', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_email
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>

                {/* Factory Address */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    data.footer_show_factory
                      ? 'border-neutral-300 bg-white shadow-sm'
                      : 'border-dashed border-neutral-300 bg-neutral-50 opacity-70'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Building2 className="h-4 w-4 text-neutral-800" />
                    Factory Atelier
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_factory', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_factory
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_factory', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_factory
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>

                {/* Showroom Address */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    data.footer_show_showroom
                      ? 'border-neutral-300 bg-white shadow-sm'
                      : 'border-dashed border-neutral-300 bg-neutral-50 opacity-70'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Store className="h-4 w-4 text-neutral-800" />
                    Design Showroom
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_showroom', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_showroom
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_showroom', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_showroom
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>

                {/* Social media strip */}
                <div
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${
                    data.footer_show_socials
                      ? 'border-neutral-300 bg-white shadow-sm'
                      : 'border-dashed border-neutral-300 bg-neutral-50 opacity-70'
                  }`}
                >
                  <span className="flex items-center gap-2.5 text-sm font-medium text-neutral-800">
                    <Globe className="h-4 w-4 text-neutral-800" />
                    Social Media Row
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_socials', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_socials
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_socials', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_socials
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: SOCIAL MEDIA ACCOUNTS */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                  <Globe className="h-5 w-5 text-neutral-800" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-neutral-900">
                    4. Social Media Accounts
                  </h2>
                  <p className="text-sm text-neutral-500">
                    Configure official social platforms displayed in the footer
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAddSocial('instagram')}
                className="inline-flex items-center gap-1.5 self-start rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-medium text-white transition-all hover:bg-neutral-800"
              >
                <Plus className="h-4 w-4" />
                Add Platform
              </button>
            </div>

            <div className="space-y-3">
              {socialItems.map((item, index) => {
                const currentPreset =
                  PLATFORM_PRESETS.find((p) => p.id === item.platform) || {
                    id: 'custom',
                    name: 'Custom',
                    placeholder: 'https://...',
                  };
                const badgeClass = getPlatformBadgeStyle(item.platform);

                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-neutral-50/70 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleMoveSocial(index, 'up')}
                        disabled={index === 0}
                        className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSocial(index, 'down')}
                        disabled={index === socialItems.length - 1}
                        className="rounded p-1 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-700 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="relative w-full shrink-0 sm:w-56">
                      <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded border ${badgeClass}`}
                        >
                          <PlatformIcon
                            platform={item.platform}
                            className="h-3.5 w-3.5"
                          />
                        </span>
                      </div>
                      <select
                        value={item.platform}
                        onChange={(e) =>
                          handleSocialChange(item.id, 'platform', e.target.value)
                        }
                        className="w-full appearance-none rounded-lg border border-neutral-200 bg-white py-2 pr-8 pl-11 text-xs font-semibold uppercase text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      >
                        {PLATFORM_PRESETS.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="relative flex-1">
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) =>
                          handleSocialChange(item.id, 'url', e.target.value)
                        }
                        placeholder={currentPreset.placeholder}
                        className="w-full rounded-lg border border-neutral-200 bg-white px-4 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSocial(item.id)}
                      className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600 sm:self-center"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}

              {/* Quick Add Presets Row */}
              <div className="mt-3 flex flex-wrap items-center gap-2 pt-2 text-xs text-neutral-500">
                <span className="font-medium text-xs">Quick add:</span>
                {PLATFORM_PRESETS.filter(
                  (p) => !socialItems.some((item) => item.platform === p.id),
                ).map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleAddSocial(preset.id)}
                    className="inline-flex items-center gap-1 rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-xs text-neutral-700 shadow-sm transition-all hover:border-neutral-900"
                  >
                    <PlatformIcon platform={preset.id} className="h-3.5 w-3.5" />+{' '}
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: BRAND IDENTITY, TAGLINE & COPYRIGHT */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <PanelBottom className="h-5 w-5 text-neutral-800" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  5. Brand Monogram, Tagline &amp; Copyright Notice
                </h2>
                <p className="text-sm text-neutral-500">
                  Bottom brand typography subtitle and legal copyright notice
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Footer Monogram Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={data.footer_tagline}
                  onChange={(e) => setData('footer_tagline', e.target.value)}
                  placeholder="HASIBUAN DESIGN · THE CONTEMPORARY AND ART FINES FURNITURE"
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
                <p className="mt-1 text-[11px] text-neutral-500">
                  Rendered in uppercase wide tracking below the Hasibuan Designs logo mark.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Copyright Notice Text
                </label>
                <input
                  type="text"
                  value={data.footer_copyright}
                  onChange={(e) => setData('footer_copyright', e.target.value)}
                  placeholder="© 2026 HASIBUAN DESIGN. ALL RIGHTS RESERVED. ARCHITECTURAL & INTERIOR DESIGN DESIGNS PROTECTED."
                  className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-neutral-600">
                  Short Store Description (Metadata &amp; Search Fallback)
                </label>
                <textarea
                  rows={2}
                  value={data.footer_description}
                  onChange={(e) => setData('footer_description', e.target.value)}
                  placeholder="Minimalist furniture crafted from sustainable materials. Created for those who find luxury in simplicity."
                  className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-xs text-neutral-900 focus:border-neutral-900 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* SECTION 6: LEGAL PAGES & SITEMAP */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-100">
                <ShieldCheck className="h-5 w-5 text-neutral-800" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  6. Legal Pages &amp; Bottom Utility Links
                </h2>
                <p className="text-sm text-neutral-500">
                  Control display and destination URLs for bottom legal links
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Privacy Policy */}
              <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Privacy Policy
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_privacy', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_privacy
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_privacy', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_privacy
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={data.footer_privacy_url}
                  onChange={(e) => setData('footer_privacy_url', e.target.value)}
                  placeholder="/shop/privacy-policy"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              {/* Terms of Use */}
              <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Terms of Use
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_terms', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_terms
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_terms', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_terms
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={data.footer_terms_url}
                  onChange={(e) => setData('footer_terms_url', e.target.value)}
                  placeholder="/shop/terms"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              {/* Site Map */}
              <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Site Map
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_sitemap', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_sitemap
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_sitemap', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_sitemap
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={data.footer_sitemap_url}
                  onChange={(e) => setData('footer_sitemap_url', e.target.value)}
                  placeholder="/sitemap.xml"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>

              {/* Accessibility */}
              <div className="space-y-2 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Accessibility Notice
                  </span>
                  <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-100 p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setData('footer_show_accessibility', true)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        data.footer_show_accessibility
                          ? 'bg-emerald-600 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Show
                    </button>
                    <button
                      type="button"
                      onClick={() => setData('footer_show_accessibility', false)}
                      className={`rounded px-2.5 py-0.5 font-medium ${
                        !data.footer_show_accessibility
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-600'
                      }`}
                    >
                      Hide
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={data.footer_accessibility_text}
                  onChange={(e) =>
                    setData('footer_accessibility_text', e.target.value)
                  }
                  placeholder="ACCESSIBILITY"
                  className="w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs uppercase tracking-wider text-neutral-900 focus:border-neutral-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Sticky Submit Bar */}
          <div className="sticky bottom-6 z-30 flex items-center justify-between rounded-2xl border border-neutral-200 bg-white/95 px-6 py-4 shadow-xl backdrop-blur-md">
            <span className="hidden text-xs font-medium text-neutral-500 sm:inline">
              Changes will immediately update the live storefront footer
            </span>
            <button
              type="submit"
              disabled={processing}
              className="ml-auto inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white shadow-md transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {processing ? 'Saving...' : 'Save Footer Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Confirm Save Footer Settings Dialog */}
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title={t('admin.settings.confirm_save_footer_title')}
        description={t('admin.settings.confirm_save_footer_desc')}
        confirmText={t('admin.settings.confirm_save_footer_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={processing}
        onConfirm={confirmSaveFooter}
      />
    </AdminLayout>
  );
}
