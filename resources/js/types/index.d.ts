import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
  user: User;
}

export interface BreadcrumbItem {
  title: string;
  href: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavItem {
  title: string;
  href: NonNullable<InertiaLinkProps['href']>;
  icon?: LucideIcon | null;
  isActive?: boolean;
}

export interface SiteSettings {
  site_name: string;
  site_logo?: string;
  site_description: string;
  contact_email: string;
  contact_email_2?: string;
  contact_phone: string;
  contact_whatsapp: string;
  factory_address?: string;
  showroom_address?: string;
  maps_showroom_url?: string;
  maps_factory_url?: string;
  address: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  youtube_url?: string;
  footer_description?: string;
  footer_copyright?: string;
  footer_col1_title?: string;
  footer_col1_links?: string;
  footer_col2_title?: string;
  footer_col2_links?: string;
  footer_contact_title?: string;
  footer_show_factory?: boolean;
  footer_show_showroom?: boolean;
  footer_show_phone?: boolean;
  footer_show_whatsapp?: boolean;
  footer_show_email?: boolean;
  footer_show_socials?: boolean;
  footer_privacy_url?: string;
  footer_terms_url?: string;
}

export interface PromoBannerData {
  id: number;
  title: string;
  description: string | null;
  cta_text: string;
  cta_link: string;
  icon: 'gift' | 'percent' | 'truck';
  bg_gradient: string;
  display_type: 'banner' | 'popup' | 'both';
}

export interface SharedData {
  name: string;
  quote: { message: string; author: string };
  auth: Auth;
  locale: string;
  translations: Record<string, string>;
  sidebarOpen: boolean;
  siteSettings: SiteSettings;
  featuredCategories: any[]; // Using any[] to avoid circular dependency or import issues for now, or import ApiCategory if easy
  activePromoBanners: PromoBannerData[];
  [key: string]: unknown;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  email_verified_at: string | null;
  two_factor_enabled?: boolean;
  created_at: string;
  updated_at: string;
  roles: string[];
  [key: string]: unknown; // This allows for additional properties...
}

export interface Order {
  id: number;
  order_number: string;
  subtotal: number;
  subtotal_formatted: string;
  discount_amount: number;
  discount_formatted: string;
  shipping_cost: number;
  shipping_cost_formatted: string;
  tax_amount: number;
  total: number;
  total_formatted: string;
  status: {
    value: string;
    label: string;
    color: string;
  };
  payment_status: {
    value: string;
    label: string;
    color: string;
  };
  payment_method: {
    value: string;
    label: string;
  };
  shipping_name: string;
  shipping_phone: string;
  shipping_address: string;
  shipping_city: string;
  shipping_province: string;
  shipping_postal_code: string;
  snap_token?: string;
  created_at: string;
}

declare global {
  interface Window {
    snap: any;
    route: (name: string, params?: any, absolute?: boolean) => string;
  }

  var route: (name: string, params?: any, absolute?: boolean) => string;
}
