import { SEOHead } from '@/components/seo';
import { ShopLayout } from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import {
  Database,
  Eye,
  FileCheck,
  Lock,
  Mail,
  MessageCircle,
  Share2,
  Shield,
  User,
  UserCheck,
} from 'lucide-react';

const SECTIONS = [
  {
    icon: Database,
    title: 'Information We Collect',
    content: 'We collect information provided directly by you when inquiring or placing orders:',
    items: [
      'Full legal name and commercial contact details (email address, telephone/WhatsApp number)',
      'Billing, delivery, and maritime shipping port destination addresses',
      'Payment verification information (securely processed via authorized banking channels)',
      'Inquiry records, project custom specifications, and product preferences',
    ],
  },
  {
    icon: Eye,
    title: 'How We Use Your Information',
    content: 'Your information is used strictly to deliver and improve our services:',
    items: [
      'Processing, manufacturing, and fulfilling your bespoke orders',
      'Communicating production updates, shipping schedules, and documentation',
      'Sending curated product catalogs and new collection releases (with your consent)',
      'Enhancing our website navigation and client experience',
    ],
  },
  {
    icon: Lock,
    title: 'Data Security',
    content: `We implement strict technical and organizational measures to safeguard your personal and business data from unauthorized access, alteration, or disclosure. All data transmissions across our platform are secured with modern 256-bit SSL/TLS encryption.`,
    highlights: [
      { icon: Shield, text: '256-Bit SSL Encryption' },
      { icon: Lock, text: 'Secure Cloud Infrastructure' },
      { icon: FileCheck, text: 'Periodic Security Audits' },
    ],
  },
  {
    icon: Share2,
    title: 'Information Sharing',
    content: `We respect your privacy and will never sell your personal information to third parties. Information is only shared with verified logistics carriers, customs brokers, and banking institutions strictly necessary to fulfill your order and under confidentiality obligations.`,
  },
  {
    icon: UserCheck,
    title: 'Your Rights',
    content: 'You retain full control over your personal data at all times:',
    items: [
      'Access, review, or update your registered contact details',
      'Request deletion of your profile and data records',
      'Opt out of marketing communications at any time',
      'Inquire about how your data is processed and stored',
    ],
  },
];

export default function PrivacyPolicy() {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const siteName = siteSettings?.site_name || 'Ronica';

  return (
    <>
      <SEOHead
        title="Privacy Policy"
        description={`Privacy Policy for ${siteName}. Learn how we collect, use, and protect your personal information.`}
        keywords={[
          'privacy policy',
          'data protection',
          'security policy',
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
                <Shield size={40} className="text-white" />
              </div>
              <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">
                Privacy Policy
              </h1>
              <p className="mx-auto max-w-2xl text-lg opacity-90">
                Our commitment to safeguarding your privacy and personal information
              </p>
              <p className="mt-4 text-sm opacity-70">
                Last updated: 2026
              </p>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="border-b border-neutral-100 bg-neutral-50 py-8">
            <div className="mx-auto flex max-w-[1000px] flex-wrap items-center justify-center gap-8 px-6">
              <div className="flex items-center gap-2 text-neutral-600">
                <Lock className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium">Encrypted Data</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <Shield className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium">Guaranteed Privacy</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600">
                <UserCheck className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-medium">Full Data Control</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mx-auto max-w-[1000px] px-6 py-16 md:px-12">
            {/* Intro */}
            <div className="mb-12 rounded-xl border border-teal-100 bg-teal-50/50 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-teal-100">
                  <User className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h2 className="mb-2 text-lg font-semibold text-teal-900">
                    Your Privacy is Our Priority
                  </h2>
                  <p className="text-teal-700">
                    At {siteName}, we value the trust you place in us. This policy describes how we collect, handle, and protect your information when visiting our website or ordering our handcrafted furniture.
                  </p>
                </div>
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
                    <p className="mb-4 leading-relaxed text-neutral-600">
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

                  {section.highlights && (
                    <div className="mt-6 grid gap-4 sm:grid-cols-3">
                      {section.highlights.map((highlight, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg bg-neutral-50 p-4"
                        >
                          <highlight.icon className="h-5 w-5 text-teal-600" />
                          <span className="text-sm font-medium text-neutral-700">
                            {highlight.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 rounded-xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 text-white md:p-10">
              <div className="text-center">
                <Mail className="mx-auto mb-4 h-12 w-12 opacity-90" />
                <h3 className="mb-2 text-2xl font-semibold">Contact Us</h3>
                <p className="mx-auto mb-6 max-w-md opacity-90">
                  If you have any questions regarding this Privacy Policy or how your data is handled, please feel free to reach out
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {siteSettings?.contact_email && (
                    <a
                      href={`mailto:${siteSettings.contact_email}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-medium text-teal-700 transition-colors hover:bg-teal-50"
                    >
                      <Mail className="h-5 w-5" />
                      Email
                    </a>
                  )}
                  {siteSettings?.contact_whatsapp && (
                    <a
                      href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border-2 border-white/30 bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
                    >
                      <MessageCircle className="h-5 w-5" />
                      WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </ShopLayout>
    </>
  );
}
