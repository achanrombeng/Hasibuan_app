import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ_DATA = [
    {
        category: 'Pemesanan',
        questions: [
            {
                q: 'Bagaimana cara memesan produk?',
                a: 'Pilih produk yang Anda inginkan, tambahkan ke keranjang, lalu lanjutkan ke checkout. Anda bisa memilih metode pembayaran Transfer Bank atau COD (Bayar di Tempat).',
            },
            {
                q: 'Apakah bisa custom order?',
                a: 'Ya, kami menerima custom order. Silakan hubungi kami via WhatsApp untuk konsultasi desain dan estimasi harga.',
            },
            {
                q: 'Berapa lama waktu produksi untuk custom order?',
                a: 'Waktu produksi custom order biasanya 2-4 minggu tergantung kompleksitas desain dan ketersediaan material.',
            },
        ],
    },
    {
        category: 'Pembayaran',
        questions: [
            {
                q: 'Metode pembayaran apa saja yang tersedia?',
                a: 'Kami menerima Transfer Bank (BCA, Mandiri, BNI) dan COD (Cash on Delivery) untuk area tertentu.',
            },
            {
                q: 'Apakah bisa cicilan?',
                a: 'Untuk pembelian dalam jumlah besar, silakan hubungi kami untuk diskusi mengenai opsi cicilan.',
            },
            {
                q: 'Bagaimana konfirmasi pembayaran?',
                a: 'Setelah transfer, konfirmasi pembayaran via WhatsApp dengan menyertakan bukti transfer dan nomor pesanan.',
            },
        ],
    },
    {
        category: 'Pengiriman',
        questions: [
            {
                q: 'Berapa lama waktu pengiriman?',
                a: 'Pengiriman dalam kota Jakarta 1-3 hari kerja. Luar kota 3-7 hari kerja tergantung lokasi.',
            },
            {
                q: 'Apakah ada biaya pengiriman?',
                a: 'Biaya pengiriman dihitung berdasarkan lokasi dan berat/volume produk. Free ongkir untuk area Jakarta dengan minimum pembelian tertentu.',
            },
            {
                q: 'Apakah tersedia pengiriman ke luar pulau?',
                a: 'Ya, kami melayani pengiriman ke seluruh Indonesia. Biaya dan waktu pengiriman akan diinformasikan saat checkout.',
            },
        ],
    },
    {
        category: 'Garansi & Pengembalian',
        questions: [
            {
                q: 'Apakah produk bergaransi?',
                a: 'Ya, semua produk kami bergaransi 1 tahun untuk kerusakan struktural akibat cacat produksi.',
            },
            {
                q: 'Bagaimana jika produk rusak saat pengiriman?',
                a: 'Segera hubungi kami dalam 24 jam dengan foto kerusakan. Kami akan mengganti produk atau melakukan perbaikan tanpa biaya.',
            },
            {
                q: 'Apakah bisa retur produk?',
                a: 'Retur dapat dilakukan dalam 7 hari setelah penerimaan jika produk tidak sesuai deskripsi. Biaya retur ditanggung pembeli kecuali kesalahan dari kami.',
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
                <span className="pr-4 font-medium text-terra-900">
                    {question}
                </span>
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
                                Pertanyaan Umum
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-terra-600">
                                Temukan jawaban untuk pertanyaan yang sering
                                diajukan seputar pemesanan, pembayaran, dan
                                pengiriman.
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
                                            <FAQItem
                                                key={idx}
                                                question={item.q}
                                                answer={item.a}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Contact CTA */}
                        {siteSettings?.contact_whatsapp && (
                            <div className="mt-16 rounded-sm bg-terra-900 p-10 text-center text-white">
                                <h3 className="mb-4 font-serif text-2xl">
                                    Masih Ada Pertanyaan?
                                </h3>
                                <p className="mb-6 text-terra-300">
                                    Tim kami siap membantu Anda
                                </p>
                                <a
                                    href={`https://wa.me/${siteSettings.contact_whatsapp}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-sm bg-green-500 px-6 py-3 font-medium text-white transition-colors hover:bg-green-600"
                                >
                                    Hubungi via WhatsApp
                                </a>
                            </div>
                        )}
                    </div>
                </main>
            </ShopLayout>
        </>
    );
}
