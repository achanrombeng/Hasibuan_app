import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface SuccessViewProps {
  onContinue: () => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ onContinue }) => {
  const [orderNumber] = useState(() => `LL-${Date.now().toString().slice(-8)}`);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-screen items-center justify-center px-6"
    >
      <div className="max-w-md text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <Check size={48} className="text-green-600" />
        </div>
        <h1 className="mb-4 font-serif text-4xl text-terra-900">
          Pesanan Berhasil!
        </h1>
        <p className="mb-8 leading-relaxed text-terra-600">
          Terima kasih atas pesanan Anda. Kami akan segera memproses dan
          mengirimkan pesanan Anda. Konfirmasi telah dikirim ke email Anda.
        </p>
        <div className="mb-8 rounded-sm bg-sand-50 p-6">
          <p className="mb-2 text-sm text-terra-500">Nomor Pesanan</p>
          <p className="font-mono text-xl text-terra-900">{orderNumber}</p>
        </div>
        <button
          onClick={onContinue}
          className="rounded-full bg-terra-900 px-10 py-4 font-medium text-white transition-colors hover:bg-wood"
        >
          Lanjut Belanja
        </button>
      </div>
    </motion.div>
  );
};

export default SuccessView;
