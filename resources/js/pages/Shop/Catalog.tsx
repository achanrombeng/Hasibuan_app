import { CatalogSection } from '@/components/shop/sections/CatalogSection';
import { ShopLayout } from '@/layouts/ShopLayout';
import { ApiCategory } from '@/types/shop';
import { Head } from '@inertiajs/react';

interface CatalogProps {
  categories?: ApiCategory[] | { data: ApiCategory[] };
}

export default function Catalog({ categories }: CatalogProps) {
  return (
    <ShopLayout>
      <Head title="Katalog Produk" />
      <CatalogSection
        categories={categories}
        className="pt-8 pb-20 md:pt-12 md:pb-28"
      />
    </ShopLayout>
  );
}
