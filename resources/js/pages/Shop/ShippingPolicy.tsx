import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Clock, MapPin, Package, Truck } from 'lucide-react';

const SHIPPING_INFO = [
    {
        icon: Truck,
        title: 'Area Jakarta',
        time: '1-3 hari kerja',
        desc: 'Gratis ongkir min. pembelian Rp 5.000.000',
    },
    {
        icon: MapPin,
        title: 'Jawa & Bali',
        time: '3-5 hari kerja',
        desc: 'Ongkir dihitung berdasarkan volume',
    },
    {
        icon: Clock,
        title: 'Luar Pulau',
        time: '5-10 hari kerja',
        desc: 'Tersedia pengiriman via kargo',
    },
    {
        icon: Package,
        title: 'Custom Order',
        time: '2-4 minggu',
        desc: 'Termasuk waktu produksi',
    },
];

export default function ShippingPolicy() {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';

    return (
        <>
            <Head title={`Kebijakan Pengiriman - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <h1 className="mb-4 font-serif text-4xl text-terra-900 md:text-5xl">
                                Kebijakan Pengiriman
                            </h1>
                            <p className="text-lg text-terra-600">
                                Informasi lengkap mengenai pengiriman produk{' '}
                                {siteName}
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
                                            <p className="font-medium text-terra-700">
                                                {item.time}
                                            </p>
                                            <p className="mt-1 text-sm text-terra-500">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Detailed Info */}
                        <div className="space-y-8 rounded-sm border border-terra-100 bg-white p-8 shadow-sm md:p-12">
                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Proses Pengiriman
                                </h2>
                                <ol className="list-decimal space-y-3 pl-6 text-terra-600">
                                    <li>
                                        Pesanan dikonfirmasi setelah pembayaran
                                        diterima
                                    </li>
                                    <li>
                                        Tim kami akan mempersiapkan dan mengemas
                                        produk dengan aman
                                    </li>
                                    <li>
                                        Anda akan menerima nomor resi untuk
                                        tracking pengiriman
                                    </li>
                                    <li>
                                        Kurir akan menghubungi sebelum
                                        pengiriman untuk koordinasi
                                    </li>
                                    <li>Produk sampai di alamat tujuan</li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Biaya Pengiriman
                                </h2>
                                <ul className="list-disc space-y-2 pl-6 text-terra-600">
                                    <li>
                                        <strong>Jakarta:</strong> Gratis untuk
                                        pembelian min. Rp 5.000.000
                                    </li>
                                    <li>
                                        <strong>Bodetabek:</strong> Mulai dari
                                        Rp 150.000
                                    </li>
                                    <li>
                                        <strong>Jawa & Bali:</strong> Dihitung
                                        berdasarkan volume dan berat
                                    </li>
                                    <li>
                                        <strong>Luar Pulau:</strong> Menggunakan
                                        ekspedisi kargo, tarif sesuai lokasi
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Pengemasan
                                </h2>
                                <p className="leading-relaxed text-terra-600">
                                    Semua produk dikemas dengan standar tinggi
                                    untuk memastikan keamanan selama pengiriman.
                                    Kami menggunakan bubble wrap, kardus tebal,
                                    dan palet kayu untuk produk berukuran besar.
                                </p>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Penerimaan Barang
                                </h2>
                                <ul className="list-disc space-y-2 pl-6 text-terra-600">
                                    <li>
                                        Periksa kondisi kemasan sebelum
                                        menandatangani bukti terima
                                    </li>
                                    <li>
                                        Dokumentasikan jika ada kerusakan
                                        kemasan saat diterima
                                    </li>
                                    <li>
                                        Laporkan kerusakan produk dalam 24 jam
                                        dengan foto bukti
                                    </li>
                                    <li>
                                        Simpan kemasan asli untuk keperluan
                                        klaim atau retur
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Catatan Penting
                                </h2>
                                <div className="rounded-sm border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-sm text-amber-800">
                                        Waktu pengiriman dapat berbeda saat
                                        momen tertentu (Hari Raya, promo besar)
                                        karena volume pesanan yang tinggi. Kami
                                        akan selalu menginformasikan estimasi
                                        terbaru kepada Anda.
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
