import { ConfirmDialog } from '@/components/ui/alert-dialog';
import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { useTranslation } from '@/hooks/use-translation';
import { type User } from '@/types';
import { Link, router } from '@inertiajs/react';
import { LayoutGrid, LogOut, Settings, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

interface UserMenuContentProps {
  user: User;
}

export function UserMenuContent({ user }: UserMenuContentProps) {
  const cleanup = useMobileNavigation();
  const { t } = useTranslation();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const isAdmin = (user as any)?.roles?.some((role: string) =>
    ['admin', 'super-admin', 'manager', 'staff'].includes(role),
  );

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLogoutDialog(true);
  };

  const confirmLogout = () => {
    cleanup();
    router.flushAll();
    router.post('/logout');
  };

  return (
    <>
      <DropdownMenuLabel className="p-0 font-normal">
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <UserInfo user={user} showEmail={true} />
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link
              className="block w-full font-medium text-teal-600"
              href="/admin"
              as="button"
              prefetch
              onClick={cleanup}
            >
              <LayoutGrid className="mr-2" />
              Panel Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem asChild>
          <Link
            className="block w-full"
            href="/admin/profile"
            as="button"
            prefetch
            onClick={cleanup}
          >
            <UserIcon className="mr-2" />
            Profil Saya
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            className="block w-full"
            href="/admin/settings"
            as="button"
            prefetch
            onClick={cleanup}
          >
            <Settings className="mr-2" />
            Pengaturan
          </Link>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center px-2 py-1.5 text-sm text-red-600 hover:bg-red-50 focus:bg-red-50"
          onClick={handleLogoutClick}
          data-test="logout-button"
        >
          <LogOut className="mr-2 h-4 w-4" />
          {t('common.logout')}
        </button>
      </DropdownMenuItem>

      <ConfirmDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
        title={t('common.logout_confirm_title')}
        description={t('common.logout_confirm_desc')}
        confirmText={t('common.logout_confirm_button')}
        cancelText={t('common.cancel')}
        variant="danger"
        onConfirm={confirmLogout}
      />
    </>
  );
}
