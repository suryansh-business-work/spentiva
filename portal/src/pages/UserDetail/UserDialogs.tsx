import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNotify } from '@/components/Notify';
import { ResetPasswordForm } from '@/forms/reset-password';
import { UserEditForm } from '@/forms/user-edit';
import type { AdminUserFieldsFragment, RulesFieldsFragment } from '@/gql/graphql';
import { useResetPassword, useUpdateUser } from '@/hooks/mutations';

export type UserDialog = 'edit' | 'password' | null;

interface UserDialogsProps {
  open: UserDialog;
  onClose: () => void;
  user: AdminUserFieldsFragment;
  rules: RulesFieldsFragment;
  isSelf: boolean;
}

/** Edit-user and reset-password dialogs (react-hook-form + zod forms) */
export function UserDialogs({ open, onClose, user, rules, isSelf }: Readonly<UserDialogsProps>) {
  const notify = useNotify();
  const update = useUpdateUser();
  const reset = useResetPassword();

  const close = () => {
    update.reset();
    reset.reset();
    onClose();
  };

  return (
    <>
      <Dialog open={open === 'edit'} onClose={close} fullWidth maxWidth="sm" aria-labelledby="edit-user-title">
        <DialogTitle id="edit-user-title">Edit {user.name}</DialogTitle>
        <DialogContent>
          <UserEditForm
            user={user}
            rules={rules}
            isSelf={isSelf}
            error={update.error}
            onCancel={close}
            onSubmit={async (input) => {
              await update.mutateAsync({ id: user.id, input });
              notify.success('User updated');
              close();
            }}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={open === 'password'} onClose={close} fullWidth maxWidth="xs" aria-labelledby="reset-password-title">
        <DialogTitle id="reset-password-title">New password for {user.name}</DialogTitle>
        <DialogContent>
          <ResetPasswordForm
            rules={rules}
            error={reset.error}
            onCancel={close}
            onSubmit={async (password) => {
              await reset.mutateAsync({ id: user.id, password });
              notify.success('Password changed');
              close();
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
