import React from 'react';

interface TrustLogo {
  name: string;
  logo_url?: string;
}

interface RHTrustSectionProps {
  logos: (string | TrustLogo)[];
}

export const RHTrustSection: React.FC<RHTrustSectionProps> = ({ logos = [] }) => {
  if (!logos || logos.length === 0) return null;

  const normalizedLogos: TrustLogo[] = logos.map((logo) =>
    typeof logo === 'string' ? { name: logo, logo_url: '' } : logo,
  );

  return (
    <section className="w-full bg-[#fcfcfb] py-12 md:py-16 px-6 border-b border-neutral-200/60 select-none">
      <div className="max-w-[1400px] mx-auto text-center space-y-6">
        <span className="text-[10px] tracking-[0.35em] uppercase text-neutral-400 font-light block">
          FEATURED IN & ARCHITECTURAL ACCREDITATIONS
        </span>

        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 lg:gap-20">
          {normalizedLogos.map((logo, idx) => (
            <div
              key={`${logo.name}-${idx}`}
              className="flex items-center justify-center opacity-65 hover:opacity-100 transition-opacity duration-300"
            >
              {logo.logo_url ? (
                <img
                  src={logo.logo_url}
                  alt={logo.name}
                  className="h-6 sm:h-8 w-auto object-contain filter grayscale"
                />
              ) : (
                <span className="font-serif text-lg sm:text-2xl font-light tracking-[0.12em] uppercase text-neutral-700">
                  {logo.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
