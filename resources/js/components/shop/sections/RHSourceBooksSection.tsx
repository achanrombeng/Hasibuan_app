import { BookOpen, Download, ExternalLink, Sparkles } from 'lucide-react';
import React from 'react';

interface RHSourceBooksSectionProps {
  onOpenCatalog: () => void;
  title?: string;
  pdfUrl?: string;
}

export const RHSourceBooksSection: React.FC<RHSourceBooksSectionProps> = ({
  onOpenCatalog,
  title = 'THE 2026 SOURCE BOOKS',
  pdfUrl = '/catalogs/ronica-catalog-2026.pdf',
}) => {
  return (
    <section className="w-full bg-[#111111] text-white py-20 md:py-32 px-6 sm:px-10 lg:px-16 border-b border-neutral-800">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Book 3D Mockup / Presentation */}
        <div className="lg:col-span-6 flex justify-center">
          <div
            onClick={onOpenCatalog}
            className="group relative cursor-pointer select-none max-w-md w-full"
          >
            {/* Ambient luxury glow */}
            <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Book Spine & Cover Mockup */}
            <div className="relative aspect-[3/4] w-full bg-[#1c1c1b] border border-neutral-700/80 shadow-2xl p-8 sm:p-12 flex flex-col justify-between overflow-hidden transition-transform duration-500 group-hover:-translate-y-2">
              {/* Subtle texture / spine crease effect */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />
              
              {/* Top Cover Emblem */}
              <div className="border-b border-neutral-700/60 pb-6 flex items-center justify-between">
                <span className="text-[10px] tracking-[0.4em] uppercase font-light text-neutral-400">
                  VOL. XXIV
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase font-mono text-neutral-500">
                  2026 EDITION
                </span>
              </div>

              {/* Main Cover Typography */}
              <div className="my-auto py-8 text-center space-y-4">
                <span className="block font-serif text-5xl sm:text-6xl tracking-[0.25em] font-light text-white">
                  R H
                </span>
                <div className="w-8 h-[1px] bg-neutral-500 mx-auto" />
                <h3 className="font-serif text-lg sm:text-xl tracking-[0.2em] font-normal uppercase text-neutral-200">
                  THE OUTDOOR SOURCE BOOK
                </h3>
                <p className="text-[11px] tracking-[0.25em] text-neutral-400 font-light uppercase">
                  ARCHITECTURAL TEAK & ARTISAN CRAFT
                </p>
              </div>

              {/* Bottom Cover Footer */}
              <div className="border-t border-neutral-700/60 pt-4 flex items-center justify-between text-[10px] tracking-[0.25em] uppercase text-neutral-400">
                <span>CURATED PORTFOLIO</span>
                <span className="group-hover:text-white transition-colors flex items-center gap-1">
                  CLICK TO READ <BookOpen size={12} className="inline" />
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Description & CTAs */}
        <div className="lg:col-span-6 space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <span className="text-[11px] tracking-[0.35em] uppercase text-neutral-400 font-light block">
              THE PRINT & DIGITAL COLLECTION
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.06em] leading-[1.12] uppercase text-white">
              {title}
            </h2>
            <div className="w-12 h-[1px] bg-neutral-600 mx-auto lg:mx-0 my-4" />
            <p className="text-sm sm:text-base font-light text-neutral-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Curated architectural source books featuring our complete master collection: certified sustainable teak, all-weather hand-woven fibers, sculptural dining suites, and private residence installations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 max-w-md mx-auto lg:mx-0 py-2 border-y border-neutral-800 text-left">
            <div>
              <span className="block font-serif text-2xl font-light text-white">400+</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light">
                CURATED PAGES
              </span>
            </div>
            <div>
              <span className="block font-serif text-2xl font-light text-white">3D FLIP</span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 font-light">
                INTERACTIVE VIEWER
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <button
              type="button"
              onClick={onOpenCatalog}
              className="w-full sm:w-auto px-8 py-3.5 border border-white bg-white text-black text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              EXPLORE DIGITAL SOURCE BOOK
            </button>
            <a
              href={pdfUrl}
              download
              className="w-full sm:w-auto px-8 py-3.5 border border-neutral-600 text-neutral-200 text-[11px] tracking-[0.28em] uppercase font-light hover:border-white hover:text-white transition-colors inline-flex items-center justify-center gap-2"
            >
              <Download size={14} /> DOWNLOAD PDF
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
