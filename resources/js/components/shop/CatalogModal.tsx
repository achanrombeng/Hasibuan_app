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

    const catalogTitle = title || siteSettings?.catalog_title || 'Ronica Product Catalogue 2026';

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
                    className={`relative z-10 flex flex-col w-full bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden transition-all duration-300 ${
                        isFullscreen
                            ? 'fixed inset-0 h-screen w-screen max-w-none rounded-none z-50'
                            : 'h-[92vh] max-w-7xl rounded-2xl'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-3.5 border-b border-neutral-800 bg-neutral-900/95 backdrop-blur-sm shrink-0">
                        {/* Title & Badge */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/20 shrink-0">
                                {viewMode === '3d' ? (
                                    <Sparkles size={20} className="text-teal-400 animate-pulse" />
                                ) : (
                                    <BookOpen size={20} />
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide truncate">
                                        {catalogTitle}
                                    </h3>
                                    <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                                        {viewMode === '3d' ? '3D Interactive' : 'PDF Viewer'}
                                    </span>
                                </div>
                                <p className="text-xs text-neutral-400 truncate hidden xs:block">
                                    Explore our complete collection of outdoor & indoor furniture
                                </p>
                            </div>
                        </div>

                        {/* Mode Switcher & Action Controls */}
                        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            {/* 3D vs PDF View Mode Selector */}
                            <div className="flex items-center bg-neutral-950/80 p-1 rounded-xl border border-neutral-800 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('3d')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                        viewMode === '3d'
                                            ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-md'
                                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
                                    }`}
                                    title="Tampilan 3D Flipbook Interaktif"
                                >
                                    <Layers size={14} />
                                    <span>3D Flipbook</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('pdf')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                                        viewMode === 'pdf'
                                            ? 'bg-neutral-800 text-white shadow-md border border-neutral-700'
                                            : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60'
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
                                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors hidden md:flex cursor-pointer"
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
                                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors ml-1 cursor-pointer"
                                title="Close"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content Body */}
                    <div className="relative flex-1 min-h-0 w-full bg-neutral-950 overflow-hidden flex flex-col p-2 sm:p-3">
                        {viewMode === '3d' ? (
                            <div className="relative w-full h-full flex-1 min-h-0 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800/80">
                                <DearFlipViewer
                                    key={pdfUrl}
                                    pdfURL={pdfUrl}
                                    options={{
                                        webgl: true,
                                        backgroundColor: '#121212',
                                        duration: 700,
                                        soundEnable: true,
                                        enableSound: true,
                                    }}
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <div className="relative w-full h-full flex-1 min-h-0 rounded-xl overflow-hidden bg-white shadow-inner border border-neutral-800">
                                <object
                                    data={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                                    type="application/pdf"
                                    className="w-full h-full block border-0"
                                >
                                    <iframe
                                        src={`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                                        className="w-full h-full block border-0"
                                        title="Ronica Catalog PDF"
                                    >
                                        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-neutral-600">
                                            <p className="mb-4 text-sm">Your browser does not support inline PDF viewing.</p>
                                            <a
                                                href={pdfUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
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
                    <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 sm:px-6 bg-neutral-900/90 border-t border-neutral-800 text-xs text-neutral-400 shrink-0">
                        <div className="flex items-center gap-2 text-neutral-400">
                            {viewMode === '3d' ? (
                                <span className="inline-flex items-center gap-1.5 text-neutral-300">
                                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                                    💡 <em>Gunakan drag mouse / swipe untuk membalik halaman secara 3D, atau tombol panah navigasi.</em>
                                </span>
                            ) : (
                                <span>Tampilan dokumen PDF scroll standar.</span>
                            )}
                        </div>

                        <div className="text-neutral-500 text-xs">
                            Ronica Furniture Collection &bull; 2026
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CatalogModal;

