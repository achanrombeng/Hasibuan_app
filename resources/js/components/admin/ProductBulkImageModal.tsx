import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { router } from '@inertiajs/react';
import {
  AlertCircle,
  CheckCircle2,
  FileArchive,
  Image as ImageIcon,
  Images,
  Info,
  Loader2,
  RefreshCw,
  Search,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

interface MatchedProduct {
  id: number;
  sku: string;
  name: string;
  primary_image_url: string | null;
}

interface ImageQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  filename: string;
  detectedSku: string;
  matchedProduct: MatchedProduct | null;
  selectedProductId: number | null;
  status: 'matched' | 'unmatched' | 'manual';
}

interface BulkUploadReport {
  total: number;
  successful: number;
  failed: number;
  updated_products: string[];
  errors: Array<{ filename: string; message: string }>;
}

interface ProductBulkImageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductBulkImageModal({
  isOpen,
  onClose,
}: ProductBulkImageModalProps) {
  const [items, setItems] = useState<ImageQueueItem[]>([]);
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState<BulkUploadReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Search product dropdown state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MatchedProduct[]>([]);
  const [activeItemForSearch, setActiveItemForSearch] = useState<string | null>(
    null,
  );
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const zipInputRef = useRef<HTMLInputElement | null>(null);

  // Clean up object URLs on unmount or reset
  useEffect(() => {
    return () => {
      items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, [items]);

  // Query product search for manual picker
  useEffect(() => {
    if (!activeItemForSearch) return;

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `/admin/products/bulk-images/search?q=${encodeURIComponent(searchQuery)}`,
        );
        const data = await res.json();
        if (data.success) {
          setSearchResults(data.products || []);
        }
      } catch (err) {
        console.error('Failed to search products:', err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, activeItemForSearch]);

  const handleFileSelect = async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    // Check if user dropped a ZIP file
    const isZip =
      fileArray.length === 1 &&
      fileArray[0].name.toLowerCase().endsWith('.zip');
    if (isZip) {
      setZipFile(fileArray[0]);
      setItems([]);
      setReport(null);
      setErrorMessage(null);
      return;
    }

    setZipFile(null);
    setReport(null);
    setErrorMessage(null);
    setIsMatching(true);

    const validImages = fileArray.filter((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '');
    });

    if (validImages.length === 0) {
      setErrorMessage(
        'Tidak ada file gambar yang valid (.jpg, .jpeg, .png, .webp, .gif).',
      );
      setIsMatching(false);
      return;
    }

    // Call backend to match filenames with SKUs
    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
          ?.content || '';

      const filenames = validImages.map((f) => f.name);
      const res = await fetch('/admin/products/bulk-images/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ filenames }),
      });

      const matchData = await res.json();
      const matchesMap: Record<
        string,
        { detected_sku: string; matched: boolean; product: MatchedProduct | null }
      > = {};

      if (matchData.success && Array.isArray(matchData.matches)) {
        matchData.matches.forEach((m: any) => {
          matchesMap[m.filename] = m;
        });
      }

      const newQueueItems: ImageQueueItem[] = validImages.map((file) => {
        const matchInfo = matchesMap[file.name];
        const matchedProd = matchInfo?.product ?? null;

        return {
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          previewUrl: URL.createObjectURL(file),
          filename: file.name,
          detectedSku: matchInfo?.detected_sku || '',
          matchedProduct: matchedProd,
          selectedProductId: matchedProd?.id ?? null,
          status: matchedProd ? 'matched' : 'unmatched',
        };
      });

      setItems((prev) => [...prev, ...newQueueItems]);
    } catch (err: any) {
      console.error('Error matching filenames:', err);
      // Fallback: add items without match info
      const fallbackItems: ImageQueueItem[] = validImages.map((file) => ({
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        filename: file.name,
        detectedSku: '',
        matchedProduct: null,
        selectedProductId: null,
        status: 'unmatched',
      }));
      setItems((prev) => [...prev, ...fallbackItems]);
    } finally {
      setIsMatching(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const handleSelectProduct = (itemId: string, product: MatchedProduct) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            matchedProduct: product,
            selectedProductId: product.id,
            status: 'manual',
          };
        }
        return item;
      }),
    );
    setActiveItemForSearch(null);
    setSearchQuery('');
  };

  const handleClose = () => {
    if (isUploading) return;
    items.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    setItems([]);
    setZipFile(null);
    setReport(null);
    setErrorMessage(null);
    setActiveItemForSearch(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (zipInputRef.current) zipInputRef.current.value = '';
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((items.length === 0 && !zipFile) || isUploading) return;

    setIsUploading(true);
    setErrorMessage(null);
    setReport(null);

    const formData = new FormData();

    if (zipFile) {
      formData.append('zip_file', zipFile);
    } else {
      items.forEach((item) => {
        formData.append('images[]', item.file);
      });

      // Build mapping of filename => product_id
      const mappings: Record<string, number> = {};
      items.forEach((item) => {
        if (item.selectedProductId) {
          mappings[item.filename] = item.selectedProductId;
        }
      });
      formData.append('mappings', JSON.stringify(mappings));
    }

    try {
      const csrfToken =
        (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)
          ?.content || '';

      const res = await fetch('/admin/products/bulk-images/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMessage(
          data.message || 'Terjadi kesalahan saat memproses upload gambar.',
        );
      } else {
        setReport(data.report);
        // Refresh product list in background
        router.reload({ only: ['products'] });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Koneksi gagal saat mengunggah file.');
    } finally {
      setIsUploading(false);
    }
  };

  const matchedCount = items.filter((i) => i.selectedProductId !== null).length;
  const unmatchedCount = items.filter(
    (i) => i.selectedProductId === null,
  ).length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-hidden rounded-2xl border border-terra-200/80 bg-white p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="border-b border-terra-100 bg-gradient-to-r from-terra-50 to-sand-50/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terra-900 text-white shadow-sm">
              <Images className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-terra-900">
                Bulk Image Matcher (Upload Foto Massal)
              </DialogTitle>
              <DialogDescription className="text-sm text-terra-600">
                Unggah puluhan foto produk atau file ZIP langsung dari komputer
                dan tautkan ke SKU produk secara otomatis
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
          {/* Instructions Box */}
          <div className="rounded-xl border border-sand-200/80 bg-sand-50/70 p-4">
            <div className="flex items-start gap-2.5 text-xs text-terra-800">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-terra-700" />
              <div>
                <p className="font-semibold text-terra-900">
                  Tips Penamaan File Foto:
                </p>
                <p className="mt-0.5 text-terra-700">
                  Beri nama file foto sesuai dengan SKU produk, contoh:{' '}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-terra-900">
                    SFA-001.jpg
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-terra-900">
                    SFA-001_1.jpg
                  </code>
                  ,{' '}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono font-semibold text-terra-900">
                    TBL-DIN-002-front.png
                  </code>
                  . Sistem akan otomatis mencocokkan foto dengan produk
                  tersebut.
                </p>
              </div>
            </div>
          </div>

          {/* Form & Main Area */}
          {!report && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Dropzone */}
              <div
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files) {
                    handleFileSelect(e.dataTransfer.files);
                  }
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                className={`relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-7 text-center transition-all ${
                  isDragOver
                    ? 'border-terra-600 bg-terra-50/70'
                    : 'border-terra-200/80 bg-neutral-50/50 hover:border-terra-400 hover:bg-terra-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    if (e.target.files) handleFileSelect(e.target.files);
                  }}
                  className="hidden"
                />
                <input
                  ref={zipInputRef}
                  type="file"
                  accept=".zip"
                  onChange={(e) => {
                    if (e.target.files) handleFileSelect(e.target.files);
                  }}
                  className="hidden"
                />

                <div className="flex flex-col items-center gap-2">
                  <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-sand-100 text-terra-800 shadow-xs">
                    <UploadCloud className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-800">
                      Tarik & jatuhkan banyak foto atau file ZIP di sini
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      Format didukung: JPG, PNG, WEBP, atau file ZIP (Maks 100MB)
                    </p>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-terra-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-terra-800"
                    >
                      <ImageIcon className="h-3.5 w-3.5" />
                      Pilih Foto Gambar
                    </button>
                    <button
                      type="button"
                      onClick={() => zipInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-terra-200 bg-white px-3 py-1.5 text-xs font-semibold text-terra-900 shadow-xs transition-colors hover:bg-terra-50"
                    >
                      <FileArchive className="h-3.5 w-3.5 text-terra-700" />
                      Pilih File ZIP
                    </button>
                  </div>
                </div>
              </div>

              {/* ZIP File indicator */}
              {zipFile && (
                <div className="flex items-center justify-between rounded-xl border border-teal-200 bg-teal-50/60 p-3.5 text-xs text-teal-900">
                  <div className="flex items-center gap-2.5">
                    <FileArchive className="h-5 w-5 text-teal-700" />
                    <div>
                      <p className="font-semibold text-teal-950">
                        {zipFile.name}
                      </p>
                      <p className="text-teal-700">
                        {(zipFile.size / (1024 * 1024)).toFixed(2)} MB • File
                        ZIP siap diekstrak & dicocokkan di server
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setZipFile(null)}
                    className="rounded-lg p-1 text-teal-700 hover:bg-teal-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Matching Status Spinner */}
              {isMatching && (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-terra-100 bg-terra-50/50 p-4 text-xs font-medium text-terra-900">
                  <Loader2 className="h-4 w-4 animate-spin text-terra-700" />
                  <span>Menganalisis nama file dan mencocokkan ke database SKU...</span>
                </div>
              )}

              {/* Queue Items Table / Grid */}
              {items.length > 0 && !zipFile && (
                <div className="space-y-3">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-neutral-800">
                        Total Foto: {items.length}
                      </span>
                      <span className="rounded-full bg-green-100 px-2 py-0.5 font-medium text-green-700">
                        Cocok: {matchedCount}
                      </span>
                      {unmatchedCount > 0 && (
                        <span className="rounded-full bg-amber-100 px-2 py-0.5 font-medium text-amber-700">
                          Perlu Dipilih: {unmatchedCount}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        items.forEach((i) => URL.revokeObjectURL(i.previewUrl));
                        setItems([]);
                      }}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Hapus Semua
                    </button>
                  </div>

                  {/* Item List */}
                  <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between gap-3 rounded-xl border p-2.5 text-xs transition-colors ${
                          item.selectedProductId
                            ? 'border-green-200/80 bg-green-50/20'
                            : 'border-amber-200/80 bg-amber-50/30'
                        }`}
                      >
                        {/* Thumbnail & Filename */}
                        <div className="flex min-w-0 items-center gap-3">
                          <img
                            src={item.previewUrl}
                            alt={item.filename}
                            className="h-12 w-12 shrink-0 rounded-lg border border-neutral-200 object-cover bg-white"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-neutral-900">
                              {item.filename}
                            </p>
                            <p className="text-[11px] text-neutral-500">
                              {(item.file.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>

                        {/* Matching Target Product */}
                        <div className="relative flex items-center gap-2">
                          {item.matchedProduct ? (
                            <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-2.5 py-1.5 text-green-900">
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                              <div className="text-left">
                                <p className="font-semibold leading-none">
                                  SKU: {item.matchedProduct.sku}
                                </p>
                                <p className="mt-0.5 max-w-[140px] truncate text-[11px] text-green-700">
                                  {item.matchedProduct.name}
                                </p>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveItemForSearch(item.id);
                                  setSearchQuery('');
                                }}
                                className="ml-1 text-[11px] text-green-800 underline hover:text-green-950"
                              >
                                Ganti
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveItemForSearch(item.id);
                                setSearchQuery(item.detectedSku);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-300 bg-amber-50 px-2.5 py-1.5 font-medium text-amber-900 hover:bg-amber-100"
                            >
                              <Search className="h-3.5 w-3.5 text-amber-700" />
                              <span>Pilih Produk Manual</span>
                            </button>
                          )}

                          {/* Product Search Dropdown Popup */}
                          {activeItemForSearch === item.id && (
                            <div className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-xl border border-neutral-200 bg-white p-2 shadow-xl">
                              <div className="relative mb-2">
                                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
                                <input
                                  type="text"
                                  placeholder="Cari SKU / nama produk..."
                                  value={searchQuery}
                                  onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                  }
                                  autoFocus
                                  className="w-full rounded-lg border border-neutral-200 py-1.5 pl-8 pr-2 text-xs focus:border-terra-600 focus:outline-none"
                                />
                              </div>

                              <div className="max-h-44 space-y-1 overflow-y-auto">
                                {isSearching ? (
                                  <div className="flex items-center justify-center p-3 text-neutral-500">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  </div>
                                ) : searchResults.length > 0 ? (
                                  searchResults.map((prod) => (
                                    <button
                                      key={prod.id}
                                      type="button"
                                      onClick={() =>
                                        handleSelectProduct(item.id, prod)
                                      }
                                      className="flex w-full items-center gap-2 rounded-lg p-1.5 text-left hover:bg-terra-50"
                                    >
                                      {prod.primary_image_url ? (
                                        <img
                                          src={prod.primary_image_url}
                                          alt={prod.name}
                                          className="h-8 w-8 shrink-0 rounded object-cover"
                                        />
                                      ) : (
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-neutral-100 text-[10px] text-neutral-400">
                                          No Img
                                        </div>
                                      )}
                                      <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-neutral-900">
                                          {prod.sku}
                                        </p>
                                        <p className="truncate text-[10px] text-neutral-500">
                                          {prod.name}
                                        </p>
                                      </div>
                                    </button>
                                  ))
                                ) : (
                                  <p className="p-3 text-center text-neutral-400">
                                    Produk tidak ditemukan
                                  </p>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => setActiveItemForSearch(null)}
                                className="mt-2 w-full rounded-lg bg-neutral-100 py-1 text-center text-[11px] font-medium text-neutral-700 hover:bg-neutral-200"
                              >
                                Tutup
                              </button>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/80 p-3.5 text-xs text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={isUploading}
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={(items.length === 0 && !zipFile) || isUploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses & Menyimpan Gambar...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4" />
                      Simpan & Tautkan Foto (
                      {zipFile ? 'File ZIP' : items.length})
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Report Summary View */}
          {report && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50/70 p-4 text-teal-900">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-teal-600" />
                <div>
                  <h4 className="font-semibold">Upload Gambar Massal Selesai!</h4>
                  <p className="text-xs text-teal-700">
                    Foto produk telah diproses dengan latar belakang putih 1:1
                    dan ditautkan ke galeri produk.
                  </p>
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-xs">
                  <p className="text-xs text-neutral-500">Total Foto</p>
                  <p className="text-xl font-bold text-neutral-900">
                    {report.total}
                  </p>
                </div>
                <div className="rounded-xl border border-green-200 bg-green-50/40 p-3 shadow-xs">
                  <p className="text-xs text-green-700">Berhasil Ditautkan</p>
                  <p className="text-xl font-bold text-green-700">
                    {report.successful}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 shadow-xs">
                  <p className="text-xs text-amber-700">Dilewati / Gagal</p>
                  <p className="text-xl font-bold text-amber-700">
                    {report.failed}
                  </p>
                </div>
              </div>

              {/* Updated Products List */}
              {report.updated_products.length > 0 && (
                <div className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-4">
                  <p className="text-xs font-semibold text-neutral-900">
                    Produk yang Diperbarui ({report.updated_products.length}):
                  </p>
                  <div className="mt-2 max-h-36 space-y-1 overflow-y-auto text-xs text-neutral-700">
                    {report.updated_products.map((name, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 border border-neutral-100"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                        <span className="truncate">{name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error list if any */}
              {report.errors.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <p className="text-xs font-semibold text-amber-900">
                    Catatan File yang Dilewati ({report.errors.length}):
                  </p>
                  <div className="mt-2 max-h-32 space-y-1 overflow-y-auto text-xs text-amber-800">
                    {report.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 rounded-lg bg-white/70 p-2 border border-amber-100"
                      >
                        <span className="font-mono font-semibold">
                          {err.filename}:
                        </span>
                        <span>{err.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Final Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReport(null);
                    setItems([]);
                    setZipFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    if (zipInputRef.current) zipInputRef.current.value = '';
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Upload Gambar Lain
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl bg-terra-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-800"
                >
                  Selesai
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
