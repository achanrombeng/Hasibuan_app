import { ConfirmDialog } from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/use-translation';
import AdminLayout from '@/layouts/admin/admin-layout';
import { Head, router } from '@inertiajs/react';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

interface DealerInquiryItem {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: 'new' | 'contacted' | 'resolved' | 'archived';
  notes: string | null;
  ip_address: string | null;
  created_at: string;
}

interface Props {
  inquiries: {
    data: DealerInquiryItem[];
    current_page: number;
    last_page: number;
    total: number;
    links: any[];
  };
  filters: {
    search?: string;
    status?: string;
  };
  stats: {
    total: number;
    new: number;
    contacted: number;
    resolved: number;
  };
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  new: {
    label: 'New Inquiry',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
  },
  contacted: {
    label: 'Contacted',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  archived: {
    label: 'Archived',
    bg: 'bg-neutral-50',
    text: 'text-neutral-600',
    border: 'border-neutral-200',
  },
};

export default function DealerInquiriesIndex({
  inquiries,
  filters,
  stats,
}: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.search || '');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
  const [selectedInquiry, setSelectedInquiry] =
    useState<DealerInquiryItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] =
    useState<DealerInquiryItem | null>(null);
  const [notes, setNotes] = useState('');
  const [updateStatus, setUpdateStatus] = useState<string>('new');
  const [showSaveConfirmDialog, setShowSaveConfirmDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { t } = useTranslation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.get(
      '/admin/dealer-inquiries',
      { search: searchTerm, status: selectedStatus },
      { preserveState: true },
    );
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    router.get(
      '/admin/dealer-inquiries',
      { search: searchTerm, status: status || undefined },
      { preserveState: true },
    );
  };

  const openDetailModal = (inquiry: DealerInquiryItem) => {
    setSelectedInquiry(inquiry);
    setUpdateStatus(inquiry.status);
    setNotes(inquiry.notes || '');
  };

  const handleSaveClick = () => {
    setShowSaveConfirmDialog(true);
  };

  const confirmSaveStatus = () => {
    if (!selectedInquiry) return;
    setIsSaving(true);
    router.put(
      `/admin/dealer-inquiries/${selectedInquiry.id}`,
      { status: updateStatus, notes },
      {
        preserveScroll: true,
        onSuccess: () => {
          setShowSaveConfirmDialog(false);
          setSelectedInquiry(null);
        },
        onError: () => {
          setShowSaveConfirmDialog(false);
        },
        onFinish: () => {
          setIsSaving(false);
        },
      },
    );
  };

  const confirmDelete = (inquiry: DealerInquiryItem) => {
    setInquiryToDelete(inquiry);
    setDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (!inquiryToDelete) return;
    router.delete(`/admin/dealer-inquiries/${inquiryToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setDeleteModalOpen(false);
        setInquiryToDelete(null);
        if (selectedInquiry?.id === inquiryToDelete.id) {
          setSelectedInquiry(null);
        }
      },
    });
  };

  return (
    <AdminLayout>
      <Head title="Dealer Inquiries" />

      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Dealer & Partnership Inquiries
            </h1>
            <p className="text-sm text-neutral-500">
              Review and manage business partnership inquiries submitted from
              the website.
            </p>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                Total Inquiries
              </span>
              <Building2 className="h-5 w-5 text-neutral-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-neutral-900">
              {stats.total}
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-amber-700 uppercase">
                New Inquiries
              </span>
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-amber-800">
              {stats.new}
            </p>
          </div>

          <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-blue-700 uppercase">
                Contacted
              </span>
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-blue-800">
              {stats.contacted}
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wider text-emerald-700 uppercase">
                Resolved
              </span>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-800">
              {stats.resolved}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-xs md:flex-row md:items-center md:justify-between">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative flex-1 md:max-w-md">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or message..."
              className="w-full rounded-lg border border-neutral-200 py-2 pr-4 pl-9 text-sm text-neutral-800 placeholder-neutral-400 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none"
            />
          </form>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {['', 'new', 'contacted', 'resolved'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => handleStatusFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedStatus === status
                    ? 'bg-teal-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {status === '' ? 'All' : STATUS_CONFIG[status]?.label || status}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="border-b border-neutral-200 bg-neutral-50/80 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
                <tr>
                  <th className="px-6 py-4">Dealer / Contact</th>
                  <th className="px-6 py-4">Message Snippet</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {inquiries.data.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-12 text-center text-neutral-500"
                    >
                      No dealer inquiries found.
                    </td>
                  </tr>
                ) : (
                  inquiries.data.map((inquiry) => {
                    const statusCfg =
                      STATUS_CONFIG[inquiry.status] || STATUS_CONFIG.new;
                    return (
                      <tr
                        key={inquiry.id}
                        className="transition-colors hover:bg-neutral-50/70"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-neutral-900">
                            {inquiry.name}
                          </div>
                          <div className="mt-0.5 flex flex-col gap-0.5 text-xs text-neutral-500">
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="inline-flex items-center gap-1 hover:text-teal-600 hover:underline"
                            >
                              <Mail size={12} />
                              {inquiry.email}
                            </a>
                            {inquiry.phone && (
                              <span className="inline-flex items-center gap-1 text-neutral-500">
                                <Phone size={12} />
                                {inquiry.phone}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="max-w-xs px-6 py-4">
                          <p className="line-clamp-2 text-xs text-neutral-600">
                            {inquiry.message}
                          </p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                          >
                            {statusCfg.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs whitespace-nowrap text-neutral-500">
                          {new Date(inquiry.created_at).toLocaleDateString(
                            'en-US',
                            {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openDetailModal(inquiry)}
                              className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"
                            >
                              View Details
                            </button>
                            <button
                              type="button"
                              onClick={() => confirmDelete(inquiry)}
                              className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <Dialog
        open={!!selectedInquiry}
        onOpenChange={(open) => !open && setSelectedInquiry(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Dealer Partnership Inquiry</DialogTitle>
            <DialogDescription>
              Review the inquiry details and update follow-up status.
            </DialogDescription>
          </DialogHeader>

          {selectedInquiry && (
            <div className="space-y-4 py-2">
              {/* Contact Box */}
              <div className="space-y-2 rounded-lg border border-neutral-200 bg-neutral-50/70 p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-neutral-900">
                    {selectedInquiry.name}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {new Date(selectedInquiry.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 pt-1 text-xs text-neutral-600">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="flex items-center gap-1 font-medium text-teal-600 hover:underline"
                  >
                    <Mail size={13} />
                    {selectedInquiry.email}
                  </a>
                  {selectedInquiry.phone && (
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="flex items-center gap-1 font-medium text-neutral-700 hover:underline"
                    >
                      <Phone size={13} />
                      {selectedInquiry.phone}
                    </a>
                  )}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-700 uppercase">
                  Message
                </label>
                <div className="max-h-48 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-3.5 text-sm leading-relaxed whitespace-pre-line text-neutral-800">
                  {selectedInquiry.message}
                </div>
              </div>

              {/* Status & Notes */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 uppercase">
                    Follow-Up Status
                  </label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 bg-white p-2 text-sm text-neutral-800 outline-none focus:border-teal-500"
                  >
                    <option value="new">New Inquiry</option>
                    <option value="contacted">Contacted</option>
                    <option value="resolved">Resolved / Approved</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-neutral-700 uppercase">
                    Admin Notes
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add private internal notes (e.g. Followed up on WA, sent catalog)..."
                    className="w-full rounded-lg border border-neutral-200 p-2.5 text-sm text-neutral-800 outline-none focus:border-teal-500"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <button
                type="button"
                className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancel
              </button>
            </DialogClose>
            <button
              type="button"
              onClick={handleSaveClick}
              className="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <AlertTriangle size={24} />
            </div>
            <DialogTitle className="text-center">Delete Inquiry?</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete inquiry from{' '}
              <strong>{inquiryToDelete?.name}</strong>? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-center">
            <button
              type="button"
              onClick={() => setDeleteModalOpen(false)}
              className="flex-1 rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Save Changes Dialog */}
      <ConfirmDialog
        open={showSaveConfirmDialog}
        onOpenChange={setShowSaveConfirmDialog}
        title={t('admin.dealer_inquiries.confirm_save_title')}
        description={t('admin.dealer_inquiries.confirm_save_desc')}
        confirmText={t('admin.dealer_inquiries.confirm_save_button')}
        cancelText={t('common.cancel')}
        variant="default"
        isLoading={isSaving}
        onConfirm={confirmSaveStatus}
      />
    </AdminLayout>
  );
}
