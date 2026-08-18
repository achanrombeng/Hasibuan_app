import ShopLayout from '@/layouts/ShopLayout';
import { SiteSettings } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, CheckCircle, RefreshCw, Shield } from 'lucide-react';

export default function ReturnPolicy() {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';

    return (
        <>
            <Head title={`Kebijakan Pengembalian - ${siteName}`} />
            <div className="bg-noise" />
            <ShopLayout>
                <main className="min-h-screen bg-sand-50 pb-20">
                    <div className="mx-auto max-w-[1400px] px-6 py-12 md:px-12">
                        {/* Header */}
                        <div className="mb-12 text-center">
                            <h1 className="mb-4 font-serif text-4xl text-terra-900 md:text-5xl">
                                Kebijakan Pengembalian
                            </h1>
                            <p className="text-lg text-terra-600">
                                Kepuasan Anda adalah prioritas kami
                            </p>
                        </div>

                        {/* Highlight Cards */}
                        <div className="mb-12 grid gap-6 md:grid-cols-3">
                            <div className="rounded-sm border border-terra-100 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                                    <RefreshCw className="h-7 w-7 text-teal-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-terra-900">
                                    7 Hari Retur
                                </h3>
                                <p className="text-sm text-terra-500">
                                    Untuk produk tidak sesuai deskripsi
                                </p>
                            </div>
                            <div className="rounded-sm border border-terra-100 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                                    <Shield className="h-7 w-7 text-teal-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-terra-900">
                                    Garansi 1 Tahun
                                </h3>
                                <p className="text-sm text-terra-500">
                                    Untuk kerusakan struktural
                                </p>
                            </div>
                            <div className="rounded-sm border border-terra-100 bg-white p-6 text-center shadow-sm">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-100">
                                    <CheckCircle className="h-7 w-7 text-teal-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-medium text-terra-900">
                                    Refund Penuh
                                </h3>
                                <p className="text-sm text-terra-500">
                                    Jika kesalahan dari kami
                                </p>
                            </div>
                        </div>

                        {/* Detailed Policy */}
                        <div className="space-y-8 rounded-sm border border-terra-100 bg-white p-8 shadow-sm md:p-12">
                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Syarat Pengembalian
                                </h2>
                                <ul className="list-disc space-y-2 pl-6 text-terra-600">
                                    <li>
                                        Pengembalian dalam waktu 7 hari setelah
                                        barang diterima
                                    </li>
                                    <li>
                                        Produk dalam kondisi asli, belum
                                        digunakan, dengan label lengkap
                                    </li>
                                    <li>Kemasan asli harus disertakan</li>
                                    <li>
                                        Sertakan bukti pembelian (invoice/order
                                        number)
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Produk yang Dapat Dikembalikan
                                </h2>
                                <ul className="space-y-3 text-terra-600">
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span>
                                            Produk tidak sesuai dengan deskripsi
                                            atau foto
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span>
                                            Produk rusak saat diterima (cacat
                                            produksi)
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span>
                                            Produk salah kirim (berbeda dari
                                            pesanan)
                                        </span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Produk yang Tidak Dapat Dikembalikan
                                </h2>
                                <ul className="space-y-3 text-terra-600">
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                                        <span>
                                            Produk custom order / made-to-order
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                                        <span>
                                            Produk yang sudah digunakan atau
                                            dimodifikasi
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                                        <span>Produk tanpa kemasan asli</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
                                        <span>
                                            Produk dengan label sale/clearance
                                        </span>
                                    </li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Proses Pengembalian
                                </h2>
                                <ol className="list-decimal space-y-3 pl-6 text-terra-600">
                                    <li>
                                        Hubungi CS kami via WhatsApp dengan
                                        nomor pesanan dan alasan retur
                                    </li>
                                    <li>
                                        Tim kami akan memverifikasi permintaan
                                        dalam 1x24 jam
                                    </li>
                                    <li>
                                        Jika disetujui, kirimkan produk ke
                                        alamat yang diberikan
                                    </li>
                                    <li>
                                        Setelah produk diterima dan diperiksa,
                                        refund diproses dalam 7-14 hari kerja
                                    </li>
                                </ol>
                            </section>

                            <section>
                                <h2 className="mb-4 font-serif text-2xl text-terra-900">
                                    Biaya Pengembalian
                                </h2>
                                <div className="space-y-2 rounded-sm bg-terra-50 p-4">
                                    <p className="text-terra-700">
                                        <strong>Kesalahan dari kami:</strong>{' '}
                                        Biaya pengiriman retur ditanggung{' '}
                                        {siteName}
                                    </p>
                                    <p className="text-terra-700">
                                        <strong>Berubah pikiran:</strong> Biaya
                                        pengiriman retur ditanggung pembeli
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
