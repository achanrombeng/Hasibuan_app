import DearFlipViewer from '@/components/DearFlipViewer';
import { useTranslation } from '@/hooks/use-translation';
import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    BookOpen,
    ExternalLink,
    FileText,
    Maximize2,
    Minimize2,
    Sparkles,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

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
    const { t } = useTranslation();
    const { siteSettings } = usePage<{ siteSettings?: SiteSettings }>().props;
    const [viewMode, setViewMode] = useState<'flipbook' | 'pdf'>('flipbook');
    const [isFullscreen, setIsFullscreen] = useState(false);

    const catalogTitle = title || siteSettings?.catalog_title || 'Ronica Product Catalogue 2026';

    // Auto-center and recalculate 3D viewport on fullscreen/viewmode toggle
    useEffect(() => {
        if (!isOpen) return;
        const timers = [50, 150, 300, 450, 600].map((ms) =>
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, ms)
        );
        return () => timers.forEach(clearTimeout);
    }, [isFullscreen, viewMode, isOpen]);

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
                            {/* View Switcher */}
                            <div className="flex items-center rounded-lg bg-neutral-800 p-1 border border-neutral-700/60">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('flipbook')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${viewMode === 'flipbook'
                                        ? 'bg-teal-600 text-white shadow-sm'
                                        : 'text-neutral-400 hover:text-neutral-200'
                                        }`}
                                    title="View as 3D Interactive Flipbook"
                                >
                                    <BookOpen size={14} />
                                    <span className="hidden sm:inline">Flipbook 3D</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('pdf')}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${viewMode === 'pdf'
                                        ? 'bg-teal-600 text-white shadow-sm'
                                        : 'text-neutral-400 hover:text-neutral-200'
                                        }`}
                                    title="View as Standard PDF Reader"
                                >
                                    <FileText size={14} />
                                    <span className="hidden sm:inline">Standard PDF</span>
                                </button>
                            </div>

                            {/* Open in New Tab */}
                            <a
                                href={pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors hidden sm:flex cursor-pointer"
                                title="Open PDF in new tab"
                            >
                                <ExternalLink size={16} />
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
                    <div className="relative flex-1 w-full h-full bg-neutral-950 overflow-hidden flex items-center justify-center p-1 sm:p-3">
                        {viewMode === 'flipbook' ? (
                            <div className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-neutral-900 border border-neutral-800/80 flex items-center justify-center">
                                <DearFlipViewer
                                    key={`dflip-${isFullscreen ? 'fullscreen' : 'modal'}-${pdfUrl}`}
                                    pdfURL={pdfUrl}
                                    className="w-full h-full"
                                    options={{
                                        webgl: true,
                                        autoEnableOutline: false,
                                        autoEnableThumbnail: false,
                                        height: '100%',
                                        backgroundColor: '#0a0a0a',
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="w-full h-full rounded-xl overflow-hidden shadow-inner bg-neutral-900 border border-neutral-800">
                                <iframe
                                    src={pdfUrl}
                                    className="w-full h-full border-0 rounded-xl"
                                    title="Ronica Catalog PDF"
                                />
                            </div>
                        )}
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
