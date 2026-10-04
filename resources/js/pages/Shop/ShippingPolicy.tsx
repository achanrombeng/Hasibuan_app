import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Clock, Globe, MapPin, Package, Truck } from 'lucide-react';

const SHIPPING_INFO = [
  {
    icon: Truck,
    title: 'Regional Delivery',
    time: '1-3 business days',
    desc: 'Local transport & direct factory dispatch',
  },
  {
    icon: MapPin,
    title: 'Domestic Transport',
    time: '3-7 business days',
    desc: 'Door-to-door delivery across islands',
  },
  {
    icon: Globe,
    title: 'Worldwide Export',
    time: 'FCL & LCL Sea Freight',
    desc: 'Exports to Australia, US, Europe & Middle East',
  },
  {
    icon: Package,
    title: 'Custom Orders',
    time: '2-4 weeks',
    desc: 'Includes specialized craftsmanship & curing',
  },
];

export default function ShippingPolicy() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  return (
    <>
      <Head title={`Shipping Policy - ${siteName}`} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pb-20">
          <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="mb-4 font-serif text-4xl text-terra-900 md:text-5xl">
                Shipping Policy
              </h1>
              <p className="text-lg text-terra-600">
                Comprehensive shipping and logistics information for {siteName}
              </p>
            </div>

            {/* Shipping Cards */}
            <div className="mb-12 grid gap-6 md:grid-cols-2">
              {SHIPPING_INFO.map((item) => (
                <div
                  key={item.title}
                  className="rounded-sm border border-terra-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-sm bg-terra-100">
                      <item.icon className="h-6 w-6 text-terra-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-terra-900">
                        {item.title}
                      </h3>
                      <p className="font-medium text-terra-700">{item.time}</p>
                      <p className="mt-1 text-sm text-terra-500">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Detailed Info */}
            <div className="space-y-8 rounded-sm border border-terra-100 bg-white p-8 shadow-sm md:p-12">
              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Shipping & Handling Process
                </h2>
                <ol className="list-decimal space-y-3 pl-6 text-terra-600">
                  <li>Orders are confirmed and scheduled upon payment verification</li>
                  <li>
                    Our logistics team conducts rigorous quality checks and applies export-grade packaging
                  </li>
                  <li>
                    You will receive bill of lading (B/L) or tracking details for monitoring your consignment
                  </li>
                  <li>
                    Freight partners coordinate arrival and delivery schedules directly with your receiving team
                  </li>
                  <li>Safe delivery to your specified destination or commercial warehouse</li>
                </ol>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Freight & Shipping Rates
                </h2>
                <ul className="list-disc space-y-2 pl-6 text-terra-600">
                  <li>
                    <strong>Domestic & Regional:</strong> Calculated by volume (CBM) and freight partner schedules.
                  </li>
                  <li>
                    <strong>International LCL / FCL:</strong> Containerized sea freight rates quoted per 20ft/40ft HC container or grouped cargo.
                  </li>
                  <li>
                    <strong>Custom Clearance & Duties:</strong> Standard international terms apply (FOB, CIF, or DDP upon request).
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Export Packaging Standards
                </h2>
                <p className="leading-relaxed text-terra-600">
                  All furniture pieces are packed to international maritime export standards. We utilize multi-layer protective foam, corner edge guards, heavy-duty corrugated board, and fumigated wooden pallets or crates for maximum protection during transit.
                </p>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Receipt of Goods & Inspection
                </h2>
                <ul className="list-disc space-y-2 pl-6 text-terra-600">
                  <li>
                    Inspect exterior packaging condition before signing delivery receipts
                  </li>
                  <li>
                    Document and photograph any visible container or carton damage upon arrival
                  </li>
                  <li>
                    Notify our team within 48 hours in the rare event of transit damage
                  </li>
                  <li>Keep original crates and packaging materials for insurance verification</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Important Notice
                </h2>
                <div className="rounded-sm border border-amber-200 bg-amber-50 p-4">
                  <p className="text-sm text-amber-800">
                    Lead times for international maritime freight may vary due to global port congestion, adverse weather, or customs inspections. Our logistics specialists will maintain close communication and keep you informed throughout every stage of the journey.
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
