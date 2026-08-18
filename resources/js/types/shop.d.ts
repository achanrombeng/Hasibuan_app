// ========================================
// Static types (untuk template/mock data)
// ========================================

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    description: string;
    features: string[];
    image: string;
    rating: number;
}

export interface CartItem extends Product {
    quantity: number;
}

export interface UserDetails {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    zip: string;
    cardNumber: string;
    expiry: string;
    cvc: string;
}

export type ViewState = 'landing' | 'detail' | 'checkout' | 'success';

export interface ChatMessage {
    role: 'user' | 'model';
    text: string;
}

// Category type for Indonesian furniture store
export interface Category {
    id: string;
    name: string;
    slug: string;
    image: string;
    description?: string;
}

// Testimonial type
export interface Testimonial {
    id: string;
    text: string;
    author: string;
    location: string;
    avatar?: string;
}

// ========================================
// API types (dari Laravel Backend)
// ========================================

export interface ProductImage {
    id: number;
    product_id: number;
    image_path: string;
    image_url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
}

export interface ApiCategory {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    is_active: boolean;
    is_featured: boolean;
    sort_order: number;
    products_count?: number;
    children?: ApiCategory[];
    parent?: ApiCategory;
    created_at: string;
    updated_at: string;
}

export interface ProductReview {
    id: number;
    user_id: number;
    product_id: number;
    rating: number;
    title: string | null;
    comment: string | null;
    is_approved: boolean;
    user?: {
        id: number;
        name: string;
    };
    created_at: string;
}

export interface ApiProduct {
    id: number;
    category_id: number;
    sku: string;
    name: string;
    slug: string;
    short_description: string | null;
    description: string | null;
    specifications: Record<string, string> | null;
    price: number;
    price_formatted: string;
    compare_price: number | null;
    compare_price_formatted: string | null;
    cost_price: number | null;
    cost_price_formatted: string | null;
    discount_percentage: number;
    discount_starts_at: string | null;
    discount_ends_at: string | null;
    final_price: number;
    final_price_formatted: string;
    has_discount: boolean;
    stock_quantity: number;
    low_stock_threshold: number;
    track_stock: boolean;
    allow_backorder: boolean;
    is_pre_order: boolean;
    is_in_stock: boolean;
    is_low_stock: boolean;
    is_new_arrival: boolean;
    weight: number | null;
    dimensions: {
        length?: number;
        width?: number;
        height?: number;
    } | null;
    shipping_class: string | null;
    material: string | null;
    color: string | null;
    status: {
        value: string;
        label: string;
    };
    sale_type: {
        value: string;
        label: string;
    };
    is_featured: boolean;
    average_rating: number;
    review_count: number;
    view_count: number;
    sold_count: number;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    category?: ApiCategory;
    images?: ProductImage[];
    primary_image?: ProductImage | null;
    reviews?: ProductReview[];
    is_wishlisted?: boolean;
    rating_counts?: { star: number; count: number }[];
    created_at: string;
    updated_at: string;
}

// Pagination types
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    links: PaginationLink[];
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
    meta: PaginationMeta;
}

// Filter types
export interface ProductFilters {
    filter?: {
        name?: string;
        category_id?: number;
        sale_type?: string;
        price_min?: number;
        price_max?: number;
    };
    sort?: string;
}

// ========================================
// Home Page Types
// ========================================

export interface HeroSettings {
    badge: string;
    title: string;
    title_highlight: string;
    description: string;
    image_main: string;
    image_secondary: string;
    product_name: string;
    media_type: 'image' | 'video';
}

export interface CarouselBannerSlide {
    id: string;
    image_url: string;
    link?: string;
    sort_order: number;
}

export interface HomeValue {
    icon: 'leaf' | 'truck' | 'shield-check';
    title: string;
    desc: string;
}

export interface HomeTestimonial {
    id: number;
    text: string;
    rating: number;
    author: string;
    location: string;
}

export interface HomeSiteSettings {
    name: string;
    description: string;
    phone: string;
    email: string;
    address: string;
    whatsapp: string;
}

export interface HomePageProps {
    featuredProducts: { data: ApiProduct[] };
    featuredCategories: { data: ApiCategory[] };
    testimonials: HomeTestimonial[];
    heroSettings: HeroSettings;
    trustLogos: string[];
    values: HomeValue[];
    pageSiteSettings: HomeSiteSettings;
    carouselBanners: CarouselBannerSlide[];
}
