import { motion } from 'framer-motion';
import { Clock, Flame } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface FlashSaleCountdownProps {
    endDate: Date;
    title?: string;
    className?: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

function calculateTimeLeft(endDate: Date): TimeLeft {
    const difference = endDate.getTime() - Date.now();

    if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
}

export function FlashSaleCountdown({
    endDate,
    title = 'Flash Sale Berakhir Dalam',
    className = '',
}: FlashSaleCountdownProps) {
    const initialTime = useMemo(() => calculateTimeLeft(endDate), [endDate]);
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(initialTime);

    const isExpired =
        timeLeft.days === 0 &&
        timeLeft.hours === 0 &&
        timeLeft.minutes === 0 &&
        timeLeft.seconds === 0;

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(endDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [endDate]);

    if (isExpired) {
        return (
            <div
                className={`rounded-sm bg-terra-100 p-6 text-center ${className}`}
            >
                <p className="font-medium text-terra-600">
                    Flash Sale telah berakhir
                </p>
            </div>
        );
    }

    const timeUnits = [
        { label: 'Hari', value: timeLeft.days },
        { label: 'Jam', value: timeLeft.hours },
        { label: 'Menit', value: timeLeft.minutes },
        { label: 'Detik', value: timeLeft.seconds },
    ];

    return (
        <div className={`rounded-sm p-6 text-white ${className}`}>
            <div className="mb-4 flex items-center justify-center gap-2">
                <Flame className="animate-pulse text-accent-500" size={24} />
                <h3 className="text-lg font-medium">{title}</h3>
                <Clock size={20} className="text-accent-500" />
            </div>

            <div className="flex items-center justify-center gap-3">
                {timeUnits.map((unit, index) => (
                    <div key={unit.label} className="flex items-center gap-3">
                        <motion.div
                            key={`${unit.label}-${unit.value}`}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            className="min-w-[70px] rounded-sm bg-white/20 p-3 text-center backdrop-blur-sm"
                        >
                            <div className="text-3xl font-bold tabular-nums">
                                {String(unit.value).padStart(2, '0')}
                            </div>
                            <div className="text-xs tracking-wider uppercase opacity-80">
                                {unit.label}
                            </div>
                        </motion.div>
                        {index < timeUnits.length - 1 && (
                            <span className="text-2xl font-bold opacity-60">
                                :
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function calculateTimeLeftCompact(endDate: Date): string {
    const difference = endDate.getTime() - Date.now();

    if (difference <= 0) return 'Berakhir';

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    if (hours > 24) {
        const days = Math.floor(hours / 24);
        return `${days}h ${hours % 24}j`;
    }

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// Compact version for product cards or smaller spaces
export function FlashSaleCountdownCompact({ endDate }: { endDate: Date }) {
    const initialTime = useMemo(
        () => calculateTimeLeftCompact(endDate),
        [endDate],
    );
    const [timeLeft, setTimeLeft] = useState(initialTime);

    useEffect(() => {
        const timer = setInterval(
            () => setTimeLeft(calculateTimeLeftCompact(endDate)),
            1000,
        );
        return () => clearInterval(timer);
    }, [endDate]);

    return (
        <div className="flex items-center gap-1.5 rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-medium text-white">
            <Clock size={12} />
            <span className="tabular-nums">{timeLeft}</span>
        </div>
    );
}
