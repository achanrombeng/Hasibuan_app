import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    ExternalLink,
    Maximize2,
    Minimize2,
    X
} from 'lucide-react';
import React, { useState } from 'react';

interface CatalogModalProps {
    isOpen: boolean;
    onClose: () => void;
    pdfUrl?: string;
    docxUrl?: string;
    title?: string;
}

export const CatalogModal: React.FC<CatalogModalProps> = ({
    isOpen,
    onClose,
    pdfUrl = '/catalogs/ronica-catalog-2026.pdf',
    docxUrl = '/catalogs/ronica-catalog-2026.docx',
    title,
}) => {
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const [isFullscreen, setIsFullscreen] = useState(false);

    const catalogTitle = title || siteSettings?.catalog_title || 'Ronica Product Catalogue 2026';

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden ${isFullscreen ? 'p-0' : 'p-2 sm:p-4 md:p-6'
                }`}>
                {/* Backdrop overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity"
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className={`relative z-10 flex flex-col w-full bg-neutral-900 border border-neutral-800 shadow-2xl overflow-hidden transition-all duration-300 ${isFullscreen
                        ? 'fixed inset-0 h-screen w-screen max-w-none rounded-none z-50'
                        : 'h-[90vh] max-w-6xl rounded-2xl'
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-b border-neutral-800 bg-neutral-900/90 backdrop-blur-sm shrink-0">
                        {/* Title & Badge */}
                        <div className="flex items-center gap-3 min-w-0">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/15 text-teal-400 border border-teal-500/20 shrink-0">
                                <BookOpen size={20} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-serif font-bold text-white tracking-wide truncate">
                                        {catalogTitle}
                                    </h3>
                                </div>
                                <p className="text-xs text-neutral-400 truncate hidden xs:block">
                                    Explore our complete collection of outdoor & indoor furniture
                                </p>
                            </div>
                        </div>

                        {/* View Switcher & Action Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                            {/* Open in New Tab */}
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-300 hover:text-white rounded-lg bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700/60 transition-colors cursor-pointer"
                                title="Open PDF in new tab"
                            >
                                <ExternalLink size={14} />
                                <span>Open PDF</span>
                            </a>

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
                    </div>

                    {/* Modal Footer / Bar */}
                    <div className="flex items-end justify-end px-4 py-2.5 sm:px-6 bg-neutral-900/90 border-t border-neutral-800 text-xs text-neutral-400 shrink-0">

                        <div className="text-neutral-500 text-xs">
                            Ronica Furniture Collection
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default CatalogModal;
