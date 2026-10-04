import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Copy,
  Facebook,
  Link2,
  Mail,
  MessageCircle,
  Twitter,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  description?: string;
  imageUrl?: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  description,
  imageUrl,
}) => {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-sm bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-terra-100 p-6">
              <h2 className="font-serif text-xl text-terra-900">
                Share Product
              </h2>
              <button
                onClick={onClose}
                className="rounded-full p-2 transition-colors hover:bg-terra-50"
              >
                <X size={20} className="text-terra-600" />
              </button>
            </div>

            {/* Product Preview */}
            <div className="flex gap-4 bg-sand-50 p-6">
              {imageUrl && (
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-sm bg-terra-100">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 font-medium text-terra-900">
                  {title}
                </h3>
                {description && (
                  <p className="mt-1 line-clamp-2 text-sm text-terra-500">
                    {description}
                  </p>
                )}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="p-6">
              <p className="mb-4 text-sm text-terra-500">Share via</p>
              <div className="mb-6 grid grid-cols-4 gap-3">
                {shareLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleShare(link.url)}
                    className={`flex flex-col items-center gap-2 rounded-sm p-4 text-white transition-colors ${link.color}`}
                  >
                    <link.icon size={24} />
                    <span className="text-xs">{link.name}</span>
                  </button>
                ))}
              </div>

              {/* Copy Link */}
              <div className="flex gap-2">
                <div className="flex flex-1 items-center gap-2 rounded-sm bg-terra-50 px-4 py-3">
                  <Link2 size={18} className="flex-shrink-0 text-terra-400" />
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 truncate bg-transparent text-sm text-terra-700 outline-none"
                  />
                </div>
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 rounded-sm px-4 py-3 font-medium transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-terra-900 text-white hover:bg-wood'}`}
                >
                  {copied ? (
                    <>
                      <Check size={18} /> Copied
                    </>
                  ) : (
                    <>
                      <Copy size={18} /> Copy Link
                    </>
                  )}
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
