import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Square, RectangleHorizontal, RectangleVertical } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    type Crop,
    type PixelCrop,
} from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropDialogProps {
    open: boolean;
    file: File | null;
    onClose: () => void;
    onCropped: (croppedFile: File) => void;
}

type AspectOption = {
    label: string;
    value: number | undefined;
    icon: React.ComponentType<{ className?: string }>;
};

const ASPECT_OPTIONS: AspectOption[] = [
    { label: 'Bebas', value: undefined, icon: Square },
    { label: '1:1', value: 1, icon: Square },
    { label: '4:3', value: 4 / 3, icon: RectangleHorizontal },
    { label: '3:4', value: 3 / 4, icon: RectangleVertical },
    { label: '16:9', value: 16 / 9, icon: RectangleHorizontal },
];

function initialCrop(width: number, height: number, aspect?: number): Crop {
    if (!aspect) {
        return {
            unit: '%',
            x: 5,
            y: 5,
            width: 90,
            height: 90,
        };
    }
    return centerCrop(
        makeAspectCrop({ unit: '%', width: 90 }, aspect, width, height),
        width,
        height,
    );
}

async function canvasFromCrop(
    image: HTMLImageElement,
    crop: PixelCrop,
): Promise<Blob> {
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(crop.width * scaleX);
    canvas.height = Math.round(crop.height * scaleY);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context unavailable');

    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height,
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error('Gagal membuat crop'));
                    return;
                }
                resolve(blob);
            },
            'image/jpeg',
            0.9,
        );
    });
}

export default function ImageCropDialog({
    open,
    file,
    onClose,
    onCropped,
}: ImageCropDialogProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const [aspect, setAspect] = useState<number | undefined>(undefined);
    const [saving, setSaving] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            setImageSrc(null);
            setCrop(undefined);
            setCompletedCrop(undefined);
            setAspect(undefined);
            onClose();
        }
    };

    const onImageLoad = useCallback(
        (e: React.SyntheticEvent<HTMLImageElement>) => {
            const { width, height } = e.currentTarget;
            setCrop(initialCrop(width, height, aspect));
        },
        [aspect],
    );

    useEffect(() => {
        if (!file) return;
        const url = URL.createObjectURL(file);
        setImageSrc(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const applyAspect = (next: number | undefined) => {
        setAspect(next);
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            setCrop(initialCrop(width, height, next));
        }
    };

    const handleSave = async () => {
        if (!imgRef.current || !completedCrop || !file) return;
        if (completedCrop.width === 0 || completedCrop.height === 0) return;

        setSaving(true);
        try {
            const blob = await canvasFromCrop(imgRef.current, completedCrop);
            const croppedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
            });
            onCropped(croppedFile);
            handleOpenChange(false);
        } catch (error) {
            console.error('Crop failed:', error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Gambar</DialogTitle>
                </DialogHeader>

                <div className="flex flex-wrap gap-2">
                    {ASPECT_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const active = aspect === opt.value;
                        return (
                            <button
                                key={opt.label}
                                type="button"
                                onClick={() => applyAspect(opt.value)}
                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                                    active
                                        ? 'border-wood bg-wood text-white'
                                        : 'border-terra-200 bg-white text-terra-700 hover:border-terra-300'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>

                <div className="flex max-h-[60vh] items-center justify-center overflow-auto rounded-xl bg-terra-50 p-2">
                    {imageSrc && (
                        <ReactCrop
                            crop={crop}
                            onChange={(_, percentCrop) => setCrop(percentCrop)}
                            onComplete={(c) => setCompletedCrop(c)}
                            aspect={aspect}
                            keepSelection
                        >
                            <img
                                ref={imgRef}
                                src={imageSrc}
                                alt="Crop preview"
                                onLoad={onImageLoad}
                                style={{ maxHeight: '55vh' }}
                            />
                        </ReactCrop>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => handleOpenChange(false)}
                        className="rounded-xl border border-terra-200 px-5 py-2.5 text-sm font-medium text-terra-700 transition-colors hover:bg-terra-50"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={saving || !completedCrop}
                        className="flex items-center gap-2 rounded-xl bg-terra-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-wood-dark disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            'Simpan Crop'
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
