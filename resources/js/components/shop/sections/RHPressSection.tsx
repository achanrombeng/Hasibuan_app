import { HomeTestimonial } from '@/types/shop';
import React from 'react';

interface RHPressSectionProps {
  testimonials?: HomeTestimonial[];
}

export const RHPressSection: React.FC<RHPressSectionProps> = ({
  testimonials = [],
}) => {
  const quotes =
    testimonials && testimonials.length > 0
      ? testimonials
      : [
          {
            id: '1',
            text: 'The architectural proportion and solid teak joinery rival the finest European luxury outdoor collections.',
            author: 'Architectural Digest Indonesia',
            location: 'Design Review',
          },
          {
            id: '2',
            text: 'An exceptional curation of proportion, restraint and enduring materiality that elevates the entire living estate.',
            author: 'Private Residence Commission',
            location: 'Bali Villa Estate',
          },
          {
            id: '3',
            text: 'Masterfully crafted in Jepara with world-class precision. An essential source for luxury hospitality and residential architecture.',
            author: 'Forbes Indonesia',
            location: 'Luxury Living',
          },
        ];

  return (
    <section className="w-full bg-white py-20 md:py-32 px-6 sm:px-12 border-b border-neutral-200/60">
      <div className="max-w-[1400px] mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] md:text-xs tracking-[0.35em] uppercase font-light text-neutral-500">
            PRESS & ACCOLADES
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-light tracking-[0.06em] text-neutral-900 uppercase">
            RECOGNITION OF EXCELLENCE
          </h2>
          <div className="w-12 h-[1px] bg-neutral-400 mx-auto mt-4" />
        </div>

        {/* 3-Column Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {quotes.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="text-center p-6 sm:p-8 bg-[#fafaf9] border border-neutral-200/70 flex flex-col justify-between"
            >
              <div className="font-serif text-3xl text-neutral-300 font-light mb-4">
                “
              </div>
              <p className="font-serif italic text-base sm:text-lg text-neutral-800 font-light leading-relaxed mb-6">
                {item.text}
              </p>
              <div className="border-t border-neutral-200/80 pt-4 space-y-1">
                <span className="block text-[11px] tracking-[0.2em] uppercase font-medium text-neutral-900">
                  {item.author}
                </span>
                <span className="block text-[10px] tracking-[0.15em] uppercase text-neutral-500 font-light">
                  {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
