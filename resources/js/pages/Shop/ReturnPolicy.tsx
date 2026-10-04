import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, RefreshCw, Shield } from 'lucide-react';

export default function ReturnPolicy() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'hasibuan_app';

  return (
    <>
      <Head title={`Return Policy - ${siteName}`} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pb-20">
          <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
            {/* Header */}
            <div className="mb-12 text-center">
              <h1 className="mb-4 font-serif text-4xl text-terra-900 md:text-5xl">
                Return Policy
              </h1>
              <p className="text-lg text-terra-600">
                Your satisfaction and trust are our highest priorities
              </p>
            </div>

            {/* Highlight Cards */}
            <div className="mb-12 grid gap-6 md:grid-cols-3">
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                  <RefreshCw className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-terra-900">
                  7-Day Returns
                </h3>
                <p className="text-sm text-terra-500">
                  For items not matching specifications
                </p>
              </div>
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                  <Shield className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-terra-900">
                  1-Year Warranty
                </h3>
                <p className="text-sm text-terra-500">
                  Covers structural craftsmanship defects
                </p>
              </div>
              <div className="rounded-sm border border-terra-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                  <CheckCircle className="h-7 w-7 text-teal-600" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-terra-900">
                  Full Replacement
                </h3>
                <p className="text-sm text-terra-500">
                  Guaranteed if an error originates from our side
                </p>
              </div>
            </div>

            {/* Detailed Policy */}
            <div className="space-y-8 rounded-sm border border-terra-100 bg-white p-8 shadow-sm md:p-12">
              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Return Conditions
                </h2>
                <ul className="list-disc space-y-2 pl-6 text-terra-600">
                  <li>
                    Return requests must be initiated within 7 days of receiving the item
                  </li>
                  <li>
                    Products must remain in original, unused condition with all tags and branding intact
                  </li>
                  <li>Original protective packaging must be retained</li>
                  <li>Proof of purchase (invoice or order reference) is required</li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Eligible for Return
                </h2>
                <ul className="space-y-3 text-terra-600">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>Product significantly differs from approved description or specifications</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>Product damaged on arrival due to manufacturing defect</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                    <span>Incorrect item received (different from confirmed order)</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Non-Returnable Items
                </h2>
                <ul className="space-y-3 text-terra-600">
                  <li className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <span>Custom bespoke orders and made-to-order architectural pieces</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <span>Items that have been used, assembled, altered, or modified</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <span>Items without original packaging and hardware accessories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                    <span>Final sale, clearance, or showroom sample items</span>
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Return Process
                </h2>
                <ol className="list-decimal space-y-3 pl-6 text-terra-600">
                  <li>
                    Contact our customer service team via WhatsApp or email with your order number and photos
                  </li>
                  <li>Our quality assurance team will review and verify your request within 24 hours</li>
                  <li>
                    Upon approval, dispatch instructions and shipping labels will be provided
                  </li>
                  <li>
                    Once items are received and inspected, replacements or refunds are processed within 7 to 14 business days
                  </li>
                </ol>
              </section>

              <section>
                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                  Return Shipping Costs
                </h2>
                <div className="space-y-2 rounded-sm bg-terra-50 p-4">
                  <p className="text-terra-700">
                    <strong>Manufacturing Error or Discrepancy:</strong> Return shipping and replacement costs are fully covered by {siteName}.
                  </p>
                  <p className="text-terra-700">
                    <strong>Change of Mind:</strong> Return shipping and logistics insurance are the responsibility of the purchaser.
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
