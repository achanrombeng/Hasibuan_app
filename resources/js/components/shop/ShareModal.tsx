import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Facebook, Twitter, MessageCircle, Mail, Link2 } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    url: string;
    title: string;
    description?: string;
    imageUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url, title, description, imageUrl }) => {
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);
    const encodedDesc = encodeURIComponent(description || '');

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-green-500 hover:bg-green-600',
            url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        },
        {
            name: 'Email',
            icon: Mail,
            color: 'bg-terra-600 hover:bg-terra-700',
            url: `mailto:?subject=${encodedTitle}&body=${encodedDesc}%0A%0A${encodedUrl}`,
        },
    ];

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShare = (shareLink: string) => {
        window.open(shareLink, '_blank', 'width=600,height=400');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" />
                    <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-sm shadow-2xl z-50 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-terra-100">
                            <h2 className="font-serif text-xl text-terra-900">Bagikan Produk</h2>
                            <button onClick={onClose} className="p-2 hover:bg-terra-50 rounded-full transition-colors">
                                <X size={20} className="text-terra-600" />
                            </button>
                        </div>

                        {/* Product Preview */}
                        <div className="p-6 bg-sand-50 flex gap-4">
                            {imageUrl && (
                                <div className="w-20 h-20 rounded-sm overflow-hidden flex-shrink-0 bg-terra-100">
                                    <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-terra-900 line-clamp-2">{title}</h3>
                                {description && <p className="text-sm text-terra-500 line-clamp-2 mt-1">{description}</p>}
                            </div>
                        </div>

                        {/* Share Buttons */}
                        <div className="p-6">
                            <p className="text-sm text-terra-500 mb-4">Bagikan melalui</p>
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                {shareLinks.map((link) => (
                                    <button key={link.name} onClick={() => handleShare(link.url)} className={`flex flex-col items-center gap-2 p-4 rounded-sm text-white transition-colors ${link.color}`}>
                                        <link.icon size={24} />
                                        <span className="text-xs">{link.name}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Copy Link */}
                            <div className="flex gap-2">
                                <div className="flex-1 flex items-center gap-2 bg-terra-50 rounded-sm px-4 py-3">
                                    <Link2 size={18} className="text-terra-400 flex-shrink-0" />
                                    <input type="text" value={shareUrl} readOnly className="flex-1 bg-transparent text-sm text-terra-700 outline-none truncate" />
                                </div>
                                <button onClick={handleCopyLink} className={`px-4 py-3 rounded-sm font-medium transition-colors flex items-center gap-2 ${copied ? 'bg-green-500 text-white' : 'bg-terra-900 text-white hover:bg-wood'}`}>
                                    {copied ? <><Check size={18} /> Tersalin</> : <><Copy size={18} /> Salin</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default ShareModal;

