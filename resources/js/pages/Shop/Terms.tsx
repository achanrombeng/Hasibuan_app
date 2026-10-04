import { SEOHead } from '@/components/seo';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import {
  AlertTriangle,
  Ban,
  Clock,
  CreditCard,
  FileText,
  Package,
  RefreshCw,
  Scale,
  Shield,
  Truck,
} from 'lucide-react';

const SECTIONS = [
  {
    icon: FileText,
    title: 'General Terms',
    content: `By accessing and using this website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not proceed with our services or website.`,
  },
  {
    icon: CreditCard,
    title: 'Ordering & Payment',
    items: [
      'Product specifications and commercial prices are subject to confirmation at the time of quotation or order placement.',
      'An order is considered legally binding once payment or confirmed deposit has been verified.',
      'Bank wire transfer orders require remittance confirmation within the timeframe specified in the commercial proforma invoice.',
      'We reserve the right to cancel unconfirmed orders if payment is not received within the agreed period.',
    ],
  },
  {
    icon: Truck,
    title: 'Shipping & Delivery',
    items: [
      'Lead times and transit schedules provided are estimates and subject to maritime and customs conditions.',
      'The purchaser is responsible for providing complete and accurate destination and delivery recipient details.',
      'Transit discrepancies or physical crate damage must be documented and reported within 48 hours of receipt.',
      'Additional charges resulting from incorrect address information or destination detention are borne by the purchaser.',
    ],
  },
  {
    icon: Shield,
    title: 'Product Warranty',
    content:
      'All our furniture pieces are covered by a 1-year limited warranty against manufacturing and structural defects.',
    excludes: [
      'Damage resulting from improper assembly or unauthorized third-party modifications',
      'Normal weathering and natural color variation inherent to organic teak wood',
      'Normal wear and tear from everyday commercial or residential usage',
      'Abnormal exposure to corrosive chemicals or improper maintenance',
    ],
  },
  {
    icon: RefreshCw,
    title: 'Cancellations & Claims',
    items: [
      'Standard catalog order cancellations prior to dispatch may incur administrative and processing fees.',
      'Custom bespoke and made-to-order architectural pieces cannot be cancelled once production commences.',
      'Returned items must remain in original packaging, complete with hardware and tags.',
      'Approved claims and refunds are processed within 7 to 14 business days following receipt and inspection.',
    ],
  },
  {
    icon: Ban,
    title: 'Intellectual Property',
    content: `All content featured on this website, including designs, photography, brand assets, technical diagrams, and typography, is the exclusive property of Ronica and protected by international intellectual property laws. Reproduction without written consent is strictly prohibited.`,
  },
  {
    icon: Clock,
    title: 'Amendments',
    content: `We reserve the right to update these Terms and Conditions at any time. Changes take effect immediately upon publication. Continued use of our website and services constitutes acceptance of the revised terms.`,
  },
];

export default function Terms() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  return (
    <>
      <SEOHead
        title="Terms & Conditions"
        description={`Terms and conditions for using ${siteName} services. Learn about your rights and policies.`}
        keywords={[
          'terms and conditions',
          'terms of service',
          'purchasing policy',
          siteName.toLowerCase(),
        ]}
      />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-white pb-20">
          {/* Hero */}
          <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-teal-800 py-20 text-white">
            <div className="mx-auto max-w-[1200px] px-6 text-center md:px-12">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-white/10 p-4">
                <Scale size={40} className="text-white" />
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Terms & Conditions
              </h1>
              <p className="mx-auto max-w-2xl text-lg opacity-90">
                Operating policies and conditions for the use of {siteName} services
              </p>
              <p className="mt-4 text-sm opacity-70">
                Last updated: 2026
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-12">
            {/* Intro Alert */}
            <div className="mb-12 flex items-start gap-4 rounded-lg border border-amber-200 bg-amber-50 p-6">
              <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">
                  Important Notice
                </p>
                <p className="mt-1 text-sm text-amber-700">
                  By engaging in transactions or placing orders with {siteName}, you acknowledge that you have read, understood, and agreed to the terms set forth below.
                </p>
              </div>
            </div>

            {/* Sections */}
            <div className="space-y-8">
              {SECTIONS.map((section, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md md:p-8"
                >
                  <div className="mb-4 flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50">
                      <section.icon className="h-6 w-6 text-teal-600" />
                    </div>
                    <h2 className="font-serif text-xl font-semibold text-neutral-900 md:text-2xl">
                      {index + 1}. {section.title}
                    </h2>
                  </div>

                  {section.content && (
                    <p className="leading-relaxed text-neutral-600">
                      {section.content}
                    </p>
                  )}

                  {section.items && (
                    <ul className="space-y-3">
                      {section.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-teal-500" />
                          <span className="text-neutral-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.excludes && (
                    <div className="mt-4">
                      <p className="mb-3 text-sm font-medium text-neutral-500">
                        Warranty excludes:
                      </p>
                      <ul className="space-y-2">
                        {section.excludes.map((item, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
                            <span className="text-sm text-neutral-500">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-12 rounded-xl bg-neutral-50 p-8 text-center">
              <Package className="mx-auto mb-4 h-12 w-12 text-teal-600" />
              <h3 className="mb-2 text-xl font-semibold text-neutral-900">
                Have Any Questions?
              </h3>
              <p className="mb-6 text-neutral-600">
                Our client relations team is available to assist you
              </p>
              <a
                href="/shop/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700"
              >
                Contact Us
              </a>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
