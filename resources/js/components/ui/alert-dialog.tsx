import * as React from 'react';
import {
    AlertCircle,
    CheckCircle,
    Info,
    XCircle,
} from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export type AlertType = 'info' | 'success' | 'warning' | 'error';

interface AlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description: string;
    type?: AlertType;
    confirmText?: string;
    onConfirm?: () => void;
}

const iconMap: Record<AlertType, React.ReactNode> = {
    info: <Info className="h-6 w-6 text-blue-500" />,
    success: <CheckCircle className="h-6 w-6 text-green-500" />,
    warning: <AlertCircle className="h-6 w-6 text-amber-500" />,
    error: <XCircle className="h-6 w-6 text-red-500" />,
};

const colorMap: Record<AlertType, string> = {
    info: 'bg-blue-50 border-blue-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-amber-50 border-amber-200',
    error: 'bg-red-50 border-red-200',
};

const buttonColorMap: Record<AlertType, string> = {
    info: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-green-600 hover:bg-green-700',
    warning: 'bg-amber-600 hover:bg-amber-700',
    error: 'bg-red-600 hover:bg-red-700',
};

export function AlertDialog({
    open,
    onOpenChange,
    title,
    description,
    type = 'info',
    confirmText = 'OK',
    onConfirm,
}: AlertDialogProps) {
    const handleConfirm = () => {
        onConfirm?.();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`sm:max-w-md ${colorMap[type]}`}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        {iconMap[type]}
                        {title && (
                            <DialogTitle className="text-neutral-900">
                                {title}
                            </DialogTitle>
                        )}
                    </div>
                    <DialogDescription className="pt-2 text-neutral-700">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button
                        onClick={handleConfirm}
                        className={`rounded-lg px-4 py-2 font-medium text-white transition-colors ${buttonColorMap[type]}`}
                    >
                        {confirmText}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'danger';
    onConfirm: () => void;
    onCancel?: () => void;
    isLoading?: boolean;
}

export function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = 'Konfirmasi',
    cancelText = 'Batal',
    variant = 'default',
    onConfirm,
    onCancel,
    isLoading = false,
}: ConfirmDialogProps) {
    const handleCancel = () => {
        onCancel?.();
        onOpenChange(false);
    };

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-neutral-900">{title}</DialogTitle>
                    <DialogDescription className="pt-2 text-neutral-600">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <button
                        onClick={handleCancel}
                        disabled={isLoading}
                        className="rounded-lg border border-neutral-200 bg-white px-4 py-2 font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className={`rounded-lg px-4 py-2 font-medium text-white transition-colors disabled:opacity-50 ${
                            variant === 'danger'
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-teal-600 hover:bg-teal-700'
                        }`}
                    >
                        {isLoading ? 'Memproses...' : confirmText}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// Hook for easy alert/confirm usage
interface AlertState {
    open: boolean;
    type: AlertType;
    title?: string;
    description: string;
}

export function useAlertDialog() {
    const [state, setState] = React.useState<AlertState>({
        open: false,
        type: 'info',
        description: '',
    });

    const showAlert = React.useCallback(
        (description: string, type: AlertType = 'info', title?: string) => {
            setState({ open: true, type, title, description });
        },
        [],
    );

    const closeAlert = React.useCallback(() => {
        setState((prev) => ({ ...prev, open: false }));
    }, []);

    return { state, showAlert, closeAlert };
}

interface ConfirmState {
    open: boolean;
    title: string;
    description: string;
    variant: 'default' | 'danger';
    onConfirm: () => void;
}

export function useConfirmDialog() {
    const [state, setState] = React.useState<ConfirmState>({
        open: false,
        title: '',
        description: '',
        variant: 'default',
        onConfirm: () => {},
    });

    const showConfirm = React.useCallback(
        (
            title: string,
            description: string,
            onConfirm: () => void,
            variant: 'default' | 'danger' = 'default',
        ) => {
            setState({ open: true, title, description, variant, onConfirm });
        },
        [],
    );

    const closeConfirm = React.useCallback(() => {
        setState((prev) => ({ ...prev, open: false }));
    }, []);

    return { state, showConfirm, closeConfirm };
}
