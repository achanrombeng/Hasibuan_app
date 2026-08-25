import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { destroy as profileDestroy } from '@/routes/profile';

export default function DeleteUserForm({ className = '' }: { className?: string }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy(profileDestroy.url(), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    return (
        <section className={`bg-red-50 rounded-2xl p-6 border border-red-100 ${className}`}>
            <header className="flex items-start gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-red-900">
                        Delete Account
                    </h2>
                    <p className="mt-1 text-sm text-red-600">
                        Once your account is deleted, all of its resources and data will be permanently deleted.
                    </p>
                </div>
            </header>

            <div className="mt-6">
                <Button variant="destructive" onClick={confirmUserDeletion} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                    Delete Account
                </Button>
            </div>

            <Dialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                        <DialogDescription>
                            Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={deleteUser} className="mt-6">
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                ref={passwordInput}
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-3/4"
                                placeholder="Password"
                            />

                            <InputError message={errors.password} />
                        </div>

                        <DialogFooter className="mt-6 gap-2">
                            <Button type="button" variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>

                            <Button variant="destructive" disabled={processing}>
                                Delete Account
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </section>
    );
}
