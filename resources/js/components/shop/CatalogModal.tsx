import { DearFlipViewer } from '@/components/DearFlipViewer';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BookOpen,
  ExternalLink,
  FileText,
  Layers,
  Maximize2,
  Minimize2,
  Sparkles,
  X,
} from 'lucide-react';
import React, { useState } from 'react';

interface CatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  docxUrl?: string;
  title?: string;
  initialMode?: '3d' | 'pdf';
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
  isOpen,
  onClose,
  pdfUrl = '/catalogs/ronica-catalog-2026.pdf',
  docxUrl = '/catalogs/ronica-catalog-2026.docx',
  title,
  initialMode = '3d',
}) => {
  const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | 'pdf'>(initialMode);

  const catalogTitle =
    title || siteSettings?.catalog_title || 'Ronica Product Catalogue 2026';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${
          isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
        }`}
      >
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={`relative z-10 flex w-full flex-col overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-0 z-50 h-screen w-screen max-w-none rounded-none'
              : 'h-[92vh] max-w-7xl rounded-2xl'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900/95 px-4 py-3 backdrop-blur-sm sm:px-6 sm:py-3.5">
            {/* Title & Badge */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-teal-500/20 bg-teal-500/15 text-teal-400">
                {viewMode === '3d' ? (
                  <Sparkles size={20} className="animate-pulse text-teal-400" />
                ) : (
                  <BookOpen size={20} />
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-serif text-base font-bold tracking-wide text-white sm:text-lg">
                    {catalogTitle}
                  </h3>
                  <span className="hidden items-center rounded-full border border-teal-500/30 bg-teal-500/20 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-teal-300 uppercase sm:inline-flex">
                    {viewMode === '3d' ? '3D Interactive' : 'PDF Viewer'}
                  </span>
                </div>
                <p className="xs:block hidden truncate text-xs text-neutral-400">
                  Explore our complete collection of outdoor & indoor furniture
                </p>
              </div>
            </div>

            {/* Mode Switcher & Action Controls */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
              {/* 3D vs PDF View Mode Selector */}
              <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-950/80 p-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setViewMode('3d')}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    viewMode === '3d'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                      : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                  }`}
                  title="Tampilan 3D Flipbook Interaktif"
                >
                  <Layers size={14} />
                  <span>3D Flipbook</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('pdf')}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    viewMode === 'pdf'
                      ? 'border border-neutral-700 bg-neutral-800 text-white shadow-md'
                      : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-200'
                  }`}
                  title="Tampilan Dokumen PDF Standar"
                >
                  <FileText size={14} />
                  <span>PDF Standar</span>
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="hidden cursor-pointer rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white md:flex"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 size={16} />
                ) : (
                  <Maximize2 size={16} />
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="ml-1 cursor-pointer rounded-lg p-2 text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Modal Content Body */}
          <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-neutral-950 p-2 sm:p-3">
            {viewMode === '3d' ? (
              <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-950">
                <DearFlipViewer
                  key={pdfUrl}
                  pdfURL={pdfUrl}
                  options={{
                    webgl: true,
                    backgroundColor: '#121212',
                    duration: 700,
                    soundEnable: true,
                    enableSound: true,
                    height: '100%',
                  }}
                  className="h-full w-full"
                />
              </div>
            ) : (
              <div className="relative h-full min-h-0 w-full flex-1 overflow-hidden rounded-xl border border-neutral-800 bg-white shadow-inner">
                <object
                  data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  type="application/pdf"
                  className="block h-full w-full border-0"
                >
                  <iframe
                    src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                    className="block h-full w-full border-0"
                    title="Ronica Catalog PDF"
                  >
                    <div className="flex h-full flex-col items-center justify-center p-8 text-center text-neutral-600">
                      <p className="mb-4 text-sm">
                        Your browser does not support inline PDF viewing.
                      </p>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-700"
                      >
                        <ExternalLink size={16} />
                        <span>Open / Download Catalog PDF</span>
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            )}
          </div>

          {/* Modal Footer / Bar */}
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-neutral-800 bg-neutral-900/90 px-4 py-2.5 text-xs text-neutral-400 sm:px-6">
            <div className="flex items-center gap-2 text-neutral-400">
              {viewMode === '3d' ? (
                <span className="inline-flex items-center gap-1.5 text-neutral-300">
                  <span className="h-2 w-2 animate-ping rounded-full bg-teal-400" />
                  💡{' '}
                  <em>
                    Use mouse drag / swipe to flip pages in 3D, or navigation
                    arrow buttons.
                  </em>
                </span>
              ) : (
                <span>Tampilan dokumen PDF scroll standar.</span>
              )}
            </div>

            <div className="text-xs text-neutral-500">
              Ronica Furniture Collection &bull; 2026
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CatalogModal;
