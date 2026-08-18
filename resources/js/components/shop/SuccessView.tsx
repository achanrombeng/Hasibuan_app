import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessViewProps {
    onContinue: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ onContinue }) => {
    const [orderNumber] = useState(() => `LL-${Date.now().toString().slice(-8)}`);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex items-center justify-center px-6"
        >
            <div className="text-center max-w-md">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Check size={48} className="text-green-600" />
                </div>
                <h1 className="font-serif text-4xl text-terra-900 mb-4">Pesanan Berhasil!</h1>
                <p className="text-terra-600 mb-8 leading-relaxed">
                    Terima kasih atas pesanan Anda. Kami akan segera memproses dan mengirimkan pesanan Anda. Konfirmasi telah dikirim ke email Anda.
                </p>
                <div className="bg-sand-50 p-6 rounded-sm mb-8">
                    <p className="text-terra-500 text-sm mb-2">Nomor Pesanan</p>
                    <p className="font-mono text-xl text-terra-900">{orderNumber}</p>
                </div>
                <button
                    onClick={onContinue}
                    className="bg-terra-900 text-white px-10 py-4 rounded-full font-medium hover:bg-wood transition-colors"
                >
                    Lanjut Belanja
                </button>
            </div>
        </motion.div>
    );
};

export default SuccessView;

