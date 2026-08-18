import HeadingSmall from '@/components/heading-small';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/hooks/use-translation';
import SettingsLayout from '@/layouts/settings/layout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    AlertTriangle,
    Check,
    Edit2,
    Loader2,
    MapPin,
    Plus,
    Star,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface Address {
    id: number;
    label: string;
    recipient_name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
    is_default: boolean;
    full_address: string;
}

interface Props {
    addresses: Address[];
}

export default function Addresses({ addresses }: Props) {
    const { t } = useTranslation();
    const addressList = Array.isArray(addresses) ? addresses : [];
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [deleteAddress, setDeleteAddress] = useState<Address | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { data, setData, post, put, processing, reset, errors } = useForm({
        label: '',
        recipient_name: '',
        phone: '',
        address: '',
        city: '',
        province: '',
        postal_code: '',
        is_default: false,
    });

    const openAddDialog = () => {
        reset();
        setShowAddDialog(true);
    };

    const openEditDialog = (address: Address) => {
        setData({
            label: address.label,
            recipient_name: address.recipient_name,
            phone: address.phone,
            address: address.address,
            city: address.city,
            province: address.province,
            postal_code: address.postal_code,
            is_default: address.is_default,
        });
        setEditingAddress(address);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            put(`/settings/addresses/${editingAddress.id}`, {
                onSuccess: () => {
                    setEditingAddress(null);
                    reset();
                },
            });
        } else {
            post('/settings/addresses', {
                onSuccess: () => {
                    setShowAddDialog(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = () => {
        if (deleteAddress) {
            setIsDeleting(true);
            router.delete(`/settings/addresses/${deleteAddress.id}`, {
                onFinish: () => {
                    setIsDeleting(false);
                    setDeleteAddress(null);
                },
            });
        }
    };

    const handleSetDefault = (address: Address) => {
        router.post(`/settings/addresses/${address.id}/set-default`);
    };

    return (
        <SettingsLayout>
            <Head title={t('shop.addresses.title')} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <HeadingSmall
                        title={t('shop.addresses.title')}
                        description="Kelola alamat untuk pengiriman pesanan"
                    />
                    <button
                        onClick={openAddDialog}
                        className="inline-flex items-center gap-2 rounded-sm bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                    >
                        <Plus className="h-4 w-4" />
                        {t('shop.addresses.add_new')}
                    </button>
                </div>

                {addressList.length > 0 ? (
                    <div className="space-y-4">
                        {addressList.map((addr) => (
                            <div
                                key={addr.id}
                                className={`rounded-sm border-2 p-4 transition-colors ${
                                    addr.is_default
                                        ? 'border-teal-500 bg-teal-50/50'
                                        : 'border-terra-100 bg-white'
                                }`}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="mb-2 flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-terra-500" />
                                            <span className="font-medium text-terra-900">
                                                {addr.label}
                                            </span>
                                            {addr.is_default && (
                                                <span className="rounded-full bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-700">
                                                    {t('shop.addresses.default')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-terra-700">
                                            {addr.recipient_name} • {addr.phone}
                                        </p>
                                        <p className="mt-1 text-sm text-terra-500">
                                            {addr.full_address}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!addr.is_default && (
                                            <button
                                                onClick={() =>
                                                    handleSetDefault(addr)
                                                }
                                                className="rounded-sm p-2 text-terra-500 transition-colors hover:bg-terra-50 hover:text-terra-700"
                                                title="Jadikan {t('shop.addresses.default')}"
                                            >
                                                <Star className="h-4 w-4" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => openEditDialog(addr)}
                                            className="rounded-sm p-2 text-terra-500 transition-colors hover:bg-terra-50 hover:text-terra-700"
                                        >
                                            <Edit2 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setDeleteAddress(addr)
                                            }
                                            className="rounded-sm p-2 text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="rounded-sm border-2 border-dashed border-terra-200 py-12 text-center">
                        <MapPin className="mx-auto mb-4 h-12 w-12 text-terra-200" />
                        <p className="text-terra-500">
                            Belum ada alamat tersimpan
                        </p>
                        <button
                            onClick={openAddDialog}
                            className="mt-4 inline-flex items-center gap-2 rounded-sm bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                        >
                            <Plus className="h-4 w-4" />
                            {t('shop.addresses.add_new')} Pertama
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog
                open={showAddDialog || !!editingAddress}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowAddDialog(false);
                        setEditingAddress(null);
                        reset();
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingAddress ? 'Edit Alamat' : t('shop.addresses.add_new')}
                        </DialogTitle>
                        <DialogDescription>
                            {editingAddress
                                ? 'Perbarui informasi alamat pengiriman'
                                : 'Tambahkan alamat baru untuk pengiriman'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <Label htmlFor="label">{t('shop.addresses.label')}</Label>
                                <Input
                                    id="label"
                                    value={data.label}
                                    onChange={(e) =>
                                        setData('label', e.target.value)
                                    }
                                    placeholder="Rumah, Kantor, dll"
                                    className="mt-1"
                                />
                                {errors.label && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.label}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="recipient_name">
                                    {t('shop.addresses.recipient_name')}
                                </Label>
                                <Input
                                    id="recipient_name"
                                    value={data.recipient_name}
                                    onChange={(e) =>
                                        setData(
                                            'recipient_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Nama lengkap"
                                    className="mt-1"
                                />
                                {errors.recipient_name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.recipient_name}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="phone">{t('shop.addresses.phone')}</Label>
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) =>
                                        setData('phone', e.target.value)
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    className="mt-1"
                                />
                                {errors.phone && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                            <div className="sm:col-span-2">
                                <Label htmlFor="address">{t('shop.addresses.full_address')}</Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Jl. Nama Jalan No. X"
                                    className="mt-1"
                                />
                                {errors.address && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.address}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="city">{t('shop.addresses.city')}</Label>
                                <Input
                                    id="city"
                                    value={data.city}
                                    onChange={(e) =>
                                        setData('city', e.target.value)
                                    }
                                    placeholder="Jakarta Selatan"
                                    className="mt-1"
                                />
                                {errors.city && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.city}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="province">{t('shop.addresses.province')}</Label>
                                <Input
                                    id="province"
                                    value={data.province}
                                    onChange={(e) =>
                                        setData('province', e.target.value)
                                    }
                                    placeholder="DKI Jakarta"
                                    className="mt-1"
                                />
                                {errors.province && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.province}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="postal_code">{t('shop.addresses.postal_code')}</Label>
                                <Input
                                    id="postal_code"
                                    value={data.postal_code}
                                    onChange={(e) =>
                                        setData('postal_code', e.target.value)
                                    }
                                    placeholder="12345"
                                    className="mt-1"
                                />
                                {errors.postal_code && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.postal_code}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_default"
                                    checked={data.is_default}
                                    onChange={(e) =>
                                        setData('is_default', e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-terra-300 text-teal-600 focus:ring-teal-500"
                                />
                                <Label htmlFor="is_default" className="!mb-0">
                                    Jadikan alamat utama
                                </Label>
                            </div>
                        </div>
                        <DialogFooter className="gap-2">
                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className="rounded-sm border border-terra-200 px-4 py-2 text-sm font-medium text-terra-700 transition-colors hover:bg-terra-50"
                                >
                                    Batal
                                </button>
                            </DialogClose>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center gap-2 rounded-sm bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50"
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" />
                                        {t('common.save')}
                                    </>
                                )}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteAddress}
                onOpenChange={(open) => !open && setDeleteAddress(null)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-center">
                            Hapus Alamat
                        </DialogTitle>
                        <DialogDescription className="text-center">
                            Apakah Anda yakin ingin menghapus alamat "
                            {deleteAddress?.label}"? Tindakan ini tidak dapat
                            dibatalkan.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2">
                        <DialogClose asChild>
                            <button
                                type="button"
                                className="flex-1 rounded-sm border border-terra-200 px-4 py-2.5 font-medium text-terra-700 transition-colors hover:bg-terra-50 sm:flex-none"
                            >
                                Batal
                            </button>
                        </DialogClose>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 rounded-sm bg-red-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50 sm:flex-none"
                        >
                            {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SettingsLayout>
    );
}
