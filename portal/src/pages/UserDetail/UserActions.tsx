import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutlineOutlined';
import DeleteOutline from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlined from '@mui/icons-material/EditOutlined';
import KeyOutlined from '@mui/icons-material/KeyOutlined';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router';
import { useConfirm } from '@/components/ConfirmDialog';
import { useNotify } from '@/components/Notify';
import type { AdminUserFieldsFragment } from '@/gql/graphql';
import { useDeleteUser, useUpdateUser } from '@/hooks/mutations';

interface UserActionsProps {
  user: AdminUserFieldsFragment;
  isSelf: boolean;
  onEdit: () => void;
  onResetPassword: () => void;
}

/** Edit, reset password, disable/enable and delete — every risky action asks first */
export function UserActions({ user, isSelf, onEdit, onResetPassword }: Readonly<UserActionsProps>) {
  const confirm = useConfirm();
  const notify = useNotify();
  const navigate = useNavigate();
  const update = useUpdateUser();
  const remove = useDeleteUser();

  const toggleDisabled = async () => {
    const disabling = !user.disabled;
    const ok = await confirm({
      title: disabling ? `Disable ${user.name}?` : `Enable ${user.name}?`,
      message: disabling
        ? 'They are signed out of the app and can’t log in until you enable the account again.'
        : 'They can log in to the app again.',
      confirmLabel: disabling ? 'Disable' : 'Enable',
      destructive: disabling,
    });
    if (!ok) return;
    await update.mutateAsync({ id: user.id, input: { disabled: disabling } });
    notify.success(disabling ? 'Account disabled' : 'Account enabled');
  };

  const deleteUser = async () => {
    const ok = await confirm({
      title: `Delete ${user.email}?`,
      message: 'This removes the account and all of its entries, categories, payment modes, chat and support requests. It can’t be undone.',
      confirmLabel: 'Delete account',
      destructive: true,
    });
    if (!ok) return;
    await remove.mutateAsync({ id: user.id });
    notify.success('Account deleted');
    navigate('/users', { replace: true });
  };

  const run = (task: () => Promise<void>) => () => {
    task().catch(notify.error);
  };

  return (
    <>
      <Button startIcon={<EditOutlined />} variant="outlined" onClick={onEdit}>
        Edit
      </Button>
      <Button startIcon={<KeyOutlined />} variant="outlined" onClick={onResetPassword}>
        Reset password
      </Button>
      {isSelf ? null : (
        <>
          <Button
            startIcon={user.disabled ? <CheckCircleOutline /> : <BlockIcon />}
            variant="outlined"
            color={user.disabled ? 'success' : 'warning'}
            onClick={run(toggleDisabled)}
            loading={update.isPending}
          >
            {user.disabled ? 'Enable' : 'Disable'}
          </Button>
          <Button startIcon={<DeleteOutline />} variant="outlined" color="error" onClick={run(deleteUser)} loading={remove.isPending}>
            Delete
          </Button>
        </>
      )}
    </>
  );
}
