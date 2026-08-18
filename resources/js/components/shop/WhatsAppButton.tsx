import { SiteSettings } from '@/types';
import { usePage } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';

interface WhatsAppButtonProps {
    phoneNumber: string; // Format: 628123456789 (without +)
    message?: string;
    position?: 'bottom-right' | 'bottom-left';
    showTooltip?: boolean;
}

// WhatsApp icon SVG component
function WhatsAppIcon({ size = 24 }: { size?: number }) {
    return (
        <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
}

export function WhatsAppButton({
    phoneNumber,
    message,
    position = 'bottom-right',
    showTooltip = true,
}: WhatsAppButtonProps) {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const { siteSettings } = usePage<{ siteSettings: SiteSettings }>().props;
    const siteName = siteSettings?.site_name || 'Ronica';
    const defaultMessage =
        message || `Halo, saya tertarik dengan produk di ${siteName}`;

    const positionClasses = position === 'bottom-right' ? 'right-6' : 'left-6';

    // Don't render if no phone number
    if (!phoneNumber) {
        return null;
    }

    const handleClick = () => {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;
        window.open(url, '_blank');
    };

    return (
        <div className={`fixed bottom-6 ${positionClasses} z-40`}>
            <AnimatePresence>
                {showChat && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="absolute right-0 bottom-20 mb-2 w-80 overflow-hidden rounded-sm bg-white shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between bg-[#075E54] p-4 text-white">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                                    <WhatsAppIcon size={20} />
                                </div>
                                <div>
                                    <div className="font-medium">
                                        {siteName}
                                    </div>
                                    <div className="text-xs opacity-80">
                                        Biasanya membalas dalam 1 jam
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowChat(false)}
                                className="rounded-full p-1 transition-colors hover:bg-white/20"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Body */}
                        <div className="min-h-[120px] bg-[#E5DDD5] p-4">
                            <div className="max-w-[85%] rounded-lg bg-white p-3 shadow-sm">
                                <p className="text-sm text-terra-700">
                                    Halo! 👋 Ada yang bisa kami bantu? Silakan
                                    chat kami untuk pertanyaan seputar produk,
                                    pemesanan, atau lainnya.
                                </p>
                                <p className="mt-1 text-right text-[10px] text-terra-400">
                                    Customer Service
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="border-t bg-white p-3">
                            <button
                                onClick={handleClick}
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-medium text-white transition-colors hover:bg-[#20BD5A]"
                            >
                                <MessageCircle size={20} />
                                Mulai Chat
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tooltip */}
            <AnimatePresence>
                {showTooltip && isTooltipVisible && !showChat && (
                    <motion.div
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute right-16 bottom-0 rounded-lg bg-white px-4 py-2 whitespace-nowrap shadow-lg"
                    >
                        <span className="text-sm text-terra-700">
                            Butuh bantuan?
                        </span>
                        <div className="absolute top-1/2 right-[-6px] h-0 w-0 -translate-y-1/2 border-t-[6px] border-b-[6px] border-l-[6px] border-t-transparent border-b-transparent border-l-white" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Button */}
            <motion.button
                onClick={() => setShowChat(!showChat)}
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-colors hover:bg-[#20BD5A]"
            >
                {showChat ? <X size={24} /> : <WhatsAppIcon size={28} />}
            </motion.button>
        </div>
    );
}
