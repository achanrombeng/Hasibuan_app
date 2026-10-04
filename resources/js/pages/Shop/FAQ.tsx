import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ_DATA = [
  {
    category: 'Ordering',
    questions: [
      {
        q: 'How do I place an order?',
        a: 'Browse our collection, select your desired products, and reach out to our team via inquiry or WhatsApp. We will assist you with specifications, delivery details, and order confirmation.',
      },
      {
        q: 'Do you accept custom orders?',
        a: 'Yes, we specialize in bespoke custom manufacturing for residential and commercial projects. Please contact us via WhatsApp or email for design consultations and quotations.',
      },
      {
        q: 'What is the production lead time for custom orders?',
        a: 'Production lead times typically range from 2 to 4 weeks depending on design complexity, finish options, and material availability.',
      },
    ],
  },
  {
    category: 'Payment',
    questions: [
      {
        q: 'What payment methods are available?',
        a: 'We accept international bank wire transfers (T/T), certified bank payments, and customized payment arrangements for wholesale projects.',
      },
      {
        q: 'Are installment or milestone payments available?',
        a: 'For commercial projects and volume orders, milestone-based payment schedules (e.g., deposit upon confirmation and balance prior to dispatch) are available.',
      },
      {
        q: 'How do I confirm payment?',
        a: 'After making a payment, please forward the transaction receipt along with your reference number to our sales representative via WhatsApp or email.',
      },
    ],
  },
  {
    category: 'Shipping & Logistics',
    questions: [
      {
        q: 'What are the delivery lead times?',
        a: 'Standard domestic deliveries take 2 to 5 business days. International container and freight shipments vary according to destination port and customs clearance.',
      },
      {
        q: 'How are shipping fees calculated?',
        a: 'Shipping fees are calculated based on volume (CBM), weight, and delivery destination. Our logistics team secures competitive freight rates for every shipment.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, Ronica ships to over 15 countries worldwide, including Australia, the USA, Europe, the Middle East, and Asia.',
      },
    ],
  },
  {
    category: 'Warranty & Support',
    questions: [
      {
        q: 'Do products come with a warranty?',
        a: 'Yes, all our outdoor furniture pieces include a manufacturer warranty covering structural integrity and craftsmanship under recommended use.',
      },
      {
        q: 'What if items arrive damaged during shipping?',
        a: 'Please contact us within 24 to 48 hours with photographic proof of the packaging and item. We will promptly arrange replacement or repairs without hassle.',
      },
      {
        q: 'Can items be returned?',
        a: 'Returns can be initiated within 7 days of delivery for qualifying items that do not match agreed specifications. Please review our Return Policy page for details.',
      },
    ],
  },
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-terra-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-terra-700"
      >
        <span className="pr-4 font-medium text-terra-900">{question}</span>
        <ChevronDown
          className={`h-5 w-5 flex-shrink-0 text-terra-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 pb-5' : 'max-h-0'}`}
      >
        <p className="leading-relaxed text-terra-600">{answer}</p>
      </div>
    </div>
  );
}

export default function FAQ() {
  const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  return (
    <>
      <Head title={`FAQ - ${siteName}`} />
      <div className="bg-noise" />
      <ShopLayout>
        <main className="min-h-screen bg-sand-50 pb-20">
          <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
            {/* Header */}
            <div className="mb-16 text-center">
              <h1 className="mb-4 font-serif text-4xl text-terra-900 md:text-5xl">
                Frequently Asked Questions
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-terra-600">
                Find answers to common questions about ordering, payments, and international shipping.
              </p>
            </div>

            {/* FAQ Sections */}
            <div className="space-y-12">
              {FAQ_DATA.map((section) => (
                <div
                  key={section.category}
                  className="rounded-sm border border-terra-100 bg-white p-8 shadow-sm"
                >
                  <h2 className="mb-6 font-serif text-2xl text-terra-900">
                    {section.category}
                  </h2>
                  <div className="divide-y divide-terra-100">
                    {section.questions.map((item, idx) => (
                      <FAQItem key={idx} question={item.q} answer={item.a} />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Contact CTA */}
            {siteSettings?.contact_whatsapp && (
              <div className="mt-16 rounded-sm bg-terra-900 p-10 text-center text-white">
                <h3 className="mb-4 font-serif text-2xl">
                  Still Have Questions?
                </h3>
                <p className="mb-6 text-terra-300">
                  Our dedicated team is ready to assist you.
                </p>
                <a
                  href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600"
                >
                  Contact via WhatsApp
                </a>
              </div>
            )}
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
