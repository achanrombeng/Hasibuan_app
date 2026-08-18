import {
  AlertDialog,
  ConfirmDialog,
  useAlertDialog,
  useConfirmDialog,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShopLayout } from '@/layouts/ShopLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { Edit, Loader2, MapPin, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  destroy as addressesDestroy,
  defaultMethod as addressesDefault,
  update as addressesUpdate,
  store as addressesStore,
} from '@/routes/shop/addresses';

interface Address {
  id: number;
  label: string;
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  city_id: string; // Komerce Destination ID
  province: string;
  province_id: string;
  postal_code: string;
  district?: string;
  notes?: string;
  is_default: boolean;
  full_address: string;
}

interface KomerceLocation {
  id: number;
  label: string;
  province_name: string;
  city_name: string;
  district_name: string;
  subdistrict_name: string;
  zip_code: string;
}

export default function AddressIndex({ addresses }: { addresses: Address[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const { state: alertState, showAlert, closeAlert } = useAlertDialog();
  const { state: confirmState, showConfirm, closeConfirm } = useConfirmDialog();

  const handleDelete = (id: number) => {
    showConfirm(
      'Hapus Alamat',
      'Apakah Anda yakin ingin menghapus alamat ini?',
      () => {
        router.delete(addressesDestroy.url(id), {
          onSuccess: () => console.log('Address deleted'),
          onError: () => showAlert('Gagal menghapus alamat', 'error', 'Error'),
        });
      },
      'danger',
    );
  };

  return (
    <ShopLayout>
      <Head title="Daftar Alamat" />
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar Alamat
              </h1>
              <p className="text-gray-600">Kelola alamat pengiriman Anda</p>
            </div>
            <Button
              onClick={() => {
                setEditingAddress(null);
                setIsOpen(true);
              }}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Alamat
            </Button>
          </div>

          <div className="grid gap-6">
            {addresses.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                Belum ada alamat yang tersimpan.
              </div>
            ) : (
              addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  onEdit={() => {
                    setEditingAddress(address);
                    setIsOpen(true);
                  }}
                  onDelete={() => handleDelete(address.id)}
                />
              ))
            )}
          </div>
        </div>

        <AddressFormDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          address={editingAddress}
        />

        <AlertDialog
          open={alertState.open}
          onOpenChange={closeAlert}
          title={alertState.title}
          description={alertState.description}
          type={alertState.type}
        />

        <ConfirmDialog
          open={confirmState.open}
          onOpenChange={closeConfirm}
          title={confirmState.title}
          description={confirmState.description}
          variant={confirmState.variant}
          onConfirm={confirmState.onConfirm}
        />
      </div>
    </ShopLayout>
  );
}

function AddressCard({
  address,
  onEdit,
  onDelete,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const handleSetDefault = () => {
    router.post(
      addressesDefault.url(address.id),
      {},
      {
        onSuccess: () => console.log('Set default success'),
      },
    );
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-teal-100 text-teal-600">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {address.label}
              </span>
              {address.is_default && (
                <span className="rounded bg-teal-100 px-2 py-0.5 text-xs font-medium text-teal-800">
                  Utama
                </span>
              )}
            </div>
            <h3 className="mb-1 font-medium text-gray-900">
              {address.recipient_name}
            </h3>
            <p className="mb-1 text-sm text-gray-600">{address.phone}</p>
            <p className="text-gray-600">{address.full_address}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {!address.is_default && (
            <Button variant="outline" size="sm" onClick={handleSetDefault}>
              Jadikan Utama
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            className="text-gray-500 hover:text-teal-600"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function LocationSearchInput({
  onSelect,
  initialValue,
}: {
  onSelect: (location: KomerceLocation) => void;
  initialValue?: string;
}) {
  const [query, setQuery] = useState(initialValue || '');
  const [results, setResults] = useState<KomerceLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setQuery(initialValue || '');
  }, [initialValue]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length < 3) return;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/shipping/search?search=${encodeURIComponent(query)}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Cari Kecamatan atau Kota..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowResults(true);
          }}
        />
        {loading && (
          <Loader2 className="absolute top-2.5 right-2.5 h-4 w-4 animate-spin text-gray-500" />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              className="w-full px-4 py-2 text-left text-sm hover:bg-teal-50"
              onClick={() => {
                onSelect(item);
                setShowResults(false);
                setQuery(item.label);
              }}
            >
              <div className="font-medium text-gray-900">
                {item.subdistrict_name}, {item.district_name}
              </div>
              <div className="text-xs text-gray-500">
                {item.city_name}, {item.province_name} ({item.zip_code})
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AddressFormDialog({
  open,
  onOpenChange,
  address,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  address: Address | null;
}) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    label: '',
    recipient_name: '',
    phone: '',
    address: '',
    province_id: '',
    province: '',
    city_id: '',
    city: '',
    district: '',
    postal_code: '',
    notes: '',
    is_default: false,
  });
  const { state: alertState, showAlert, closeAlert } = useAlertDialog();

  useEffect(() => {
    if (open) {
      if (address) {
        setData({
          label: address.label,
          recipient_name: address.recipient_name,
          phone: address.phone,
          address: address.address,
          province_id: address.province_id || '',
          province: address.province,
          city_id: address.city_id || '',
          city: address.city,
          district: address.district || '',
          postal_code: address.postal_code,
          notes: address.notes || '',
          is_default: address.is_default,
        });
      } else {
        reset();
      }
    }
  }, [open, address]);

  const handleLocationSelect = (loc: KomerceLocation) => {
    setData((prev) => ({
      ...prev,
      city_id: loc.id.toString(), // Store Destination ID in city_id
      province: loc.province_name,
      city: loc.city_name,
      district: `${loc.subdistrict_name}, ${loc.district_name}`,
      postal_code: loc.zip_code,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const options = {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
      onError: () =>
        showAlert('Mohon periksa form kembali.', 'warning', 'Perhatian'),
    };

    if (address) {
      put(addressesUpdate.url(address.id), options);
    } else {
      post(addressesStore.url(), options);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {address ? 'Edit Alamat' : 'Tambah Alamat Baru'}
          </DialogTitle>
          <DialogDescription>
            Isi detail alamat pengiriman Anda di bawah ini.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="label">Label Alamat</Label>
              <Input
                id="label"
                placeholder="Rumah, Kantor, dll"
                value={data.label}
                onChange={(e) => setData('label', e.target.value)}
                required
              />
              {errors.label && (
                <p className="text-xs text-red-500">{errors.label}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient_name">Nama Penerima</Label>
              <Input
                id="recipient_name"
                value={data.recipient_name}
                onChange={(e) => setData('recipient_name', e.target.value)}
                required
              />
              {errors.recipient_name && (
                <p className="text-xs text-red-500">{errors.recipient_name}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              value={data.phone}
              onChange={(e) => setData('phone', e.target.value)}
              required
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Lokasi (Cari Kecamatan / Kota)</Label>
            <LocationSearchInput
              onSelect={handleLocationSelect}
              initialValue={
                data.city
                  ? `${data.district ? data.district + ', ' : ''}${data.city}, ${data.province}`
                  : ''
              }
            />
            {errors.city_id && (
              <p className="text-xs text-red-500">
                Silakan pilih lokasi dari hasil pencarian
              </p>
            )}
          </div>

          {data.city && (
            <div className="rounded-md bg-gray-50 p-4 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Provinsi:</span> {data.province}
              </p>
              <p>
                <span className="font-semibold">Kota:</span> {data.city}
              </p>
              <p>
                <span className="font-semibold">Kecamatan:</span>{' '}
                {data.district}
              </p>
              <p>
                <span className="font-semibold">Kode Pos:</span>{' '}
                {data.postal_code}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="address">
              Alamat Lengkap (Jalan, No. Rumah, RT/RW)
            </Label>
            <textarea
              id="address"
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              required
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Catatan (Patokan/Petunjuk)</Label>
            <Input
              id="notes"
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="is_default"
              className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500"
              checked={data.is_default}
              onChange={(e) => setData('is_default', e.target.checked)}
            />
            <Label htmlFor="is_default" className="font-normal">
              Jadikan alamat utama
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700"
              disabled={processing}
            >
              {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Alamat
            </Button>
          </DialogFooter>
        </form>
        <AlertDialog
          open={alertState.open}
          onOpenChange={closeAlert}
          title={alertState.title}
          description={alertState.description}
          type={alertState.type}
        />
      </DialogContent>
    </Dialog>
  );
}
