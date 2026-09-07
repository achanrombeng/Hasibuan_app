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
  Download,
  FileSpreadsheet,
  FileUp,
  Info,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { getCsrfHeaders, getCsrfToken } from '@/lib/csrf';
import React, { useRef, useState } from 'react';

interface ImportReport {
  total_rows: number;
  imported: number;
  updated: number;
  skipped: number;
  errors: Array<{
    row: number;
    sku: string;
    message: string;
  }>;
}

interface ProductImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductImportModal({
  isOpen,
  onClose,
}: ProductImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [updateExisting, setUpdateExisting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage(null);
      setReport(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split('.').pop()?.toLowerCase();
      if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
        setFile(droppedFile);
        setErrorMessage(null);
        setReport(null);
      } else {
        setErrorMessage(
          'Format file tidak didukung. Harap gunakan file .xlsx, .xls, atau .csv.',
        );
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleClose = () => {
    if (isUploading) return;
    setFile(null);
    setReport(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || isUploading) return;

    setIsUploading(true);
    setErrorMessage(null);
    setReport(null);

    const csrfToken = getCsrfToken();
    const formData = new FormData();
    if (csrfToken) {
      formData.append('_token', csrfToken);
    }
    formData.append('file', file);
    if (updateExisting) {
      formData.append('update_existing', '1');
    }

    try {
      const response = await fetch('/admin/products/import', {
        method: 'POST',
        headers: getCsrfHeaders(),
        body: formData,
      });

      if (response.status === 419) {
        setErrorMessage(
          'Sesi Anda telah kedaluwarsa atau token keamanan tidak valid. Silakan muat ulang (refresh) halaman dan coba kembali.',
        );
        return;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        setErrorMessage(
          `Gagal memproses file (${response.status}: ${response.statusText}). Silakan refresh halaman dan coba lagi.`,
        );
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message || 'Terjadi kesalahan saat memproses file import.',
        );
      } else {
        setReport(data.report);
        // Refresh Inertia data in background so product list is updated
        router.reload({ only: ['products'] });
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Koneksi gagal saat mengunggah file.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border border-terra-200/80 bg-white p-0 shadow-2xl">
        {/* Header */}
        <DialogHeader className="border-b border-terra-100 bg-gradient-to-r from-terra-50 to-sand-50/50 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terra-900 text-white shadow-sm">
              <FileSpreadsheet className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-terra-900">
                Import Produk Massal
              </DialogTitle>
              <DialogDescription className="text-sm text-terra-600">
                Unggah file Excel (.xlsx) atau CSV untuk memasukkan banyak
                produk sekaligus
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[75vh] space-y-5 overflow-y-auto p-6">
          {/* Step 1: Download Template */}
          <div className="rounded-xl border border-sand-200/80 bg-sand-50/60 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-2.5">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-terra-700" />
                <div className="text-xs text-terra-800">
                  <p className="font-semibold text-terra-900">
                    Belum punya format Excel yang sesuai?
                  </p>
                  <p className="mt-0.5 text-terra-600">
                    Unduh template yang sudah dilengkapi nama kolom, contoh
                    produk furniture, dan petunjuk.
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href="/admin/products/import/template?format=xlsx"
                  download="ronica_template_produk.xlsx"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-terra-900 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-terra-800 active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  Template Excel (.xlsx)
                </a>
                <a
                  href="/admin/products/import/template?format=csv"
                  download="ronica_template_produk.csv"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-terra-200 bg-white px-3 py-1.5 text-xs font-semibold text-terra-800 shadow-sm transition-colors hover:bg-terra-50 active:scale-95"
                >
                  <Download className="h-3.5 w-3.5" />
                  CSV
                </a>
              </div>
            </div>
          </div>

          {/* Step 2: Upload Zone */}
          {!report && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
                  isDragOver
                    ? 'border-terra-600 bg-terra-50/70'
                    : file
                      ? 'border-teal-500 bg-teal-50/30'
                      : 'border-terra-200/80 bg-neutral-50/50 hover:border-terra-400 hover:bg-terra-50/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
                      <FileSpreadsheet className="h-7 w-7" />
                    </div>
                    <div className="mt-1 text-center">
                      <p className="font-semibold text-neutral-900">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {(file.size / 1024).toFixed(1)} KB • Klik untuk ganti
                        file
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sand-100 text-terra-700 transition-transform group-hover:scale-110">
                      <FileUp className="h-7 w-7" />
                    </div>
                    <div className="mt-1 text-center">
                      <p className="text-sm font-semibold text-neutral-800">
                        Tarik & jatuhkan file Excel / CSV di sini
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">
                        atau klik untuk memilih file dari komputer Anda (.xlsx,
                        .xls, .csv)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Options */}
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-neutral-200/80 bg-neutral-50/50 p-3.5 transition-colors hover:bg-neutral-100/50">
                <input
                  type="checkbox"
                  checked={updateExisting}
                  onChange={(e) => setUpdateExisting(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-terra-900 focus:ring-terra-900"
                />
                <div className="text-xs text-neutral-700">
                  <span className="font-semibold text-neutral-900">
                    Perbarui produk jika SKU / Nama sudah ada
                  </span>
                  <p className="mt-0.5 text-neutral-500">
                    Jika dicentang, produk dengan SKU yang sama akan diperbarui
                    dengan data dari file. Jika tidak, data tersebut akan
                    dilewati.
                  </p>
                </div>
              </label>

              {/* Error Alert */}
              {errorMessage && (
                <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/70 p-3.5 text-xs text-red-800">
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
                  disabled={!file || isUploading}
                  className="inline-flex items-center gap-2 rounded-xl bg-terra-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-terra-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Memproses Data...
                    </>
                  ) : (
                    <>
                      <FileUp className="h-4 w-4" />
                      Mulai Import
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Results / Summary Report */}
          {report && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50/70 p-4 text-teal-900">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-teal-600" />
                <div>
                  <h4 className="font-semibold">Proses Import Selesai!</h4>
                  <p className="text-xs text-teal-700">
                    Data produk telah diproses dan disimpan ke katalog.
                  </p>
                </div>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border border-neutral-200 bg-white p-3 text-center shadow-xs">
                  <p className="text-xs text-neutral-500">Total Baris</p>
                  <p className="text-xl font-bold text-neutral-900">
                    {report.total_rows}
                  </p>
                </div>
                <div className="rounded-xl border border-green-200 bg-green-50/40 p-3 text-center shadow-xs">
                  <p className="text-xs text-green-700">Ditambahkan</p>
                  <p className="text-xl font-bold text-green-700">
                    {report.imported}
                  </p>
                </div>
                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-3 text-center shadow-xs">
                  <p className="text-xs text-blue-700">Diperbarui</p>
                  <p className="text-xl font-bold text-blue-700">
                    {report.updated}
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-3 text-center shadow-xs">
                  <p className="text-xs text-amber-700">Dilewati</p>
                  <p className="text-xl font-bold text-amber-700">
                    {report.skipped}
                  </p>
                </div>
              </div>

              {/* Detailed Errors if any */}
              {report.errors && report.errors.length > 0 && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <p className="text-xs font-semibold text-amber-900">
                    Catatan / Baris yang Dilewati ({report.errors.length}):
                  </p>
                  <div className="mt-2 max-h-40 space-y-1.5 overflow-y-auto text-xs text-amber-800">
                    {report.errors.map((err, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 rounded-lg border border-amber-100 bg-white/70 p-2"
                      >
                        <span className="shrink-0 font-mono font-semibold text-amber-900">
                          Baris {err.row} ({err.sku}):
                        </span>
                        <span>{err.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Finished Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setReport(null);
                    setFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  <RefreshCw className="h-4 w-4" />
                  Import File Lain
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
