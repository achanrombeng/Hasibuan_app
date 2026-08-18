import { motion } from 'framer-motion';

interface TrustLogo {
  name: string;
  logo_url?: string;
}

interface TrustSectionProps {
  logos: (string | TrustLogo)[];
}

export const TrustSection: React.FC<TrustSectionProps> = ({ logos }) => {
  // Normalize logos to always be objects
  const normalizedLogos: TrustLogo[] = logos.map((logo) =>
    typeof logo === 'string' ? { name: logo, logo_url: '' } : logo,
  );

  const renderLogo = (logo: TrustLogo, prefix: string, index: number) => {
    if (logo.logo_url) {
      return (
        <img
          key={`${prefix}-${logo.name}-${index}`}
          src={logo.logo_url}
          alt={logo.name}
          title={logo.name}
          className="h-8 w-auto object-contain opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0 md:h-10"
        />
      );
    }
    return (
      <span
        key={`${prefix}-${logo.name}-${index}`}
        className="inline-block cursor-default font-display text-xl font-semibold text-neutral-400 transition-colors hover:text-neutral-700 md:text-2xl"
      >
        {logo.name}
      </span>
    );
  };

  return (
    <>
      {/* Trust / Press Logos Section - Marquee Style */}
      <section className="relative overflow-hidden border-y border-neutral-100 bg-white py-12">
        {/* Left Gradient Overlay */}
        <div className="pointer-events-none absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent md:w-32" />
        {/* Right Gradient Overlay */}
        <div className="pointer-events-none absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent md:w-32" />

        <p className="relative z-20 mb-8 text-center text-xs font-medium tracking-[0.2em] text-neutral-400 uppercase">
          Trusted by Modern Homes & Featured In
        </p>

        {/* Mobile: Animated Marquee */}
        <div className="relative overflow-hidden whitespace-nowrap md:hidden">
          <div className="animate-marquee inline-flex items-center gap-8">
            {/* Duplicate logos twice for seamless loop */}
            {[...normalizedLogos, ...normalizedLogos].map((logo, i) =>
              renderLogo(logo, 'mobile', i),
            )}
          </div>
        </div>

        {/* Desktop: Static */}
        <div className="relative hidden overflow-hidden md:block">
          <div className="flex items-center justify-center gap-12">
            {normalizedLogos.map((logo, i) => renderLogo(logo, 'desktop', i))}
          </div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="overflow-hidden bg-teal-500 py-6 whitespace-nowrap">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ repeat: Infinity, ease: 'linear', duration: 45 }}
          className="inline-block"
        >
          {Array(4)
            .fill(
              'Sustainability • Craftsmanship • Timeless Design • Modern Living • ',
            )
            .map((text, i) => (
              <span
                key={i}
                className="mx-8 font-serif text-lg font-medium tracking-[0.2em] text-teal-100/90 uppercase md:text-xl"
              >
                {text}
              </span>
            ))}
        </motion.div>
      </div>

      {/* CSS Keyframes for Marquee */}
      <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>
    </>
  );
};

export default TrustSection;
