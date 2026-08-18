import { Head } from '@inertiajs/react';

// Organization Schema
export interface OrganizationSchema {
    name: string;
    url: string;
    logo: string;
    description?: string;
    email?: string;
    phone?: string;
    address?: {
        street: string;
        city: string;
        region: string;
        postalCode: string;
        country: string;
    };
    socialMedia?: string[];
}

// Product Schema
export interface ProductSchema {
    name: string;
    description: string;
    image: string[];
    sku: string;
    brand?: string;
    category?: string;
    price: number;
    priceCurrency?: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
    url: string;
    rating?: {
        value: number;
        count: number;
    };
}

// Breadcrumb Schema
export interface BreadcrumbItem {
    name: string;
    url: string;
}

// WebSite Schema for search box
export interface WebsiteSchema {
    name: string;
    url: string;
    searchUrl?: string;
}

export const OrganizationStructuredData: React.FC<{ data: OrganizationSchema }> = ({ data }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: data.name,
        url: data.url,
        logo: data.logo,
        description: data.description,
        email: data.email,
        telephone: data.phone,
        address: data.address ? {
            '@type': 'PostalAddress',
            streetAddress: data.address.street,
            addressLocality: data.address.city,
            addressRegion: data.address.region,
            postalCode: data.address.postalCode,
            addressCountry: data.address.country,
        } : undefined,
        sameAs: data.socialMedia,
    };

    return (
        <Head>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Head>
    );
};

export const ProductStructuredData: React.FC<{ data: ProductSchema }> = ({ data }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: data.name,
        description: data.description,
        image: data.image,
        sku: data.sku,
        brand: data.brand ? { '@type': 'Brand', name: data.brand } : undefined,
        category: data.category,
        offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: data.priceCurrency || 'IDR',
            availability: `https://schema.org/${data.availability || 'InStock'}`,
            url: data.url,
        },
        aggregateRating: data.rating ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating.value,
            reviewCount: data.rating.count,
        } : undefined,
    };

    return (
        <Head>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Head>
    );
};

export const BreadcrumbStructuredData: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };

    return (
        <Head>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Head>
    );
};

export const WebsiteStructuredData: React.FC<{ data: WebsiteSchema }> = ({ data }) => {
    const schema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: data.name,
        url: data.url,
        potentialAction: data.searchUrl ? {
            '@type': 'SearchAction',
            target: `${data.searchUrl}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
        } : undefined,
    };

    return (
        <Head>
            <script type="application/ld+json">{JSON.stringify(schema)}</script>
        </Head>
    );
};

