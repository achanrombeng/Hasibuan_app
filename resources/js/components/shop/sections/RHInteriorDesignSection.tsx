import { Link } from '@inertiajs/react';
import React from 'react';

export const RHInteriorDesignSection: React.FC = () => {
  return (
    <section className="relative w-full bg-[#161616] text-white py-24 md:py-36 px-6 sm:px-12 lg:px-20 overflow-hidden border-b border-neutral-800">
      {/* Background Architectural Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2400&auto=format&fit=crop"
          alt="Interior Design Studio Background"
          className="w-full h-full object-cover object-center filter grayscale"
        />
        <div className="absolute inset-0 bg-neutral-950/85" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="space-y-4">
          <span className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-neutral-400 font-light block">
            ATELIER & TRADE SERVICES
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.08em] uppercase text-white leading-tight">
            RH INTERIOR DESIGN & ARCHITECTURE
          </h2>
          <div className="w-14 h-[1px] bg-neutral-600 mx-auto my-6" />
          <p className="font-serif italic text-lg sm:text-2xl text-neutral-300 font-light max-w-2xl mx-auto">
            "Our interior designers and artisans will collaborate to reimagine your space."
          </p>
        </div>

        <p className="text-xs sm:text-sm md:text-base font-light text-neutral-400 tracking-[0.06em] leading-relaxed max-w-2xl mx-auto">
          From concept sketches to custom joinery and white-glove delivery, our dedicated design studio assists private homeowners, architects, and luxury hospitality developments across the globe.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-4">
          <Link
            href="/shop/custom-order"
            className="w-full sm:w-auto px-9 py-3.5 border border-white bg-white text-black text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-neutral-200 transition-colors"
          >
            REQUEST A DESIGN CONSULTATION
          </Link>
          <Link
            href="/shop/dealer"
            className="w-full sm:w-auto px-9 py-3.5 border border-neutral-600 text-neutral-200 text-[11px] tracking-[0.28em] uppercase font-light hover:border-white hover:text-white transition-colors"
          >
            APPLY FOR TRADE PROGRAM
          </Link>
        </div>
      </div>
    </section>
  );
};
