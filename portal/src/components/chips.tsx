import Chip, { type ChipProps } from '@mui/material/Chip';
import type { LogLevel, LogSource, TicketPriority, TicketStatus, UserRole } from '@/gql/graphql';
import { LEVEL_LABELS, PRIORITY_LABELS, SOURCE_LABELS, TICKET_STATUS_LABELS } from '@/lib/labels';

type Color = ChipProps['color'];

const LEVEL_COLORS: Record<LogLevel, Color> = { FATAL: 'error', ERROR: 'warning', WARN: 'info', INFO: 'default' };
const STATUS_COLORS: Record<TicketStatus, Color> = { OPEN: 'warning', IN_PROGRESS: 'info', RESOLVED: 'success', CLOSED: 'default' };
const PRIORITY_COLORS: Record<TicketPriority, Color> = { LOW: 'default', NORMAL: 'primary', HIGH: 'warning', URGENT: 'error' };

const small = { size: 'small', variant: 'outlined' } as const;

export const LevelChip = ({ level }: Readonly<{ level: LogLevel }>) => (
  <Chip {...small} variant={level === 'FATAL' ? 'filled' : 'outlined'} color={LEVEL_COLORS[level]} label={LEVEL_LABELS[level]} />
);

export const SourceChip = ({ source }: Readonly<{ source: LogSource }>) => <Chip {...small} label={SOURCE_LABELS[source]} />;

export const TicketStatusChip = ({ status }: Readonly<{ status: TicketStatus }>) => (
  <Chip {...small} color={STATUS_COLORS[status]} label={TICKET_STATUS_LABELS[status]} />
);

export const PriorityChip = ({ priority }: Readonly<{ priority: TicketPriority }>) => (
  <Chip {...small} color={PRIORITY_COLORS[priority]} label={PRIORITY_LABELS[priority]} />
);

export const RoleChip = ({ role }: Readonly<{ role: UserRole }>) => (
  <Chip {...small} color={role === 'ADMIN' ? 'primary' : 'default'} label={role === 'ADMIN' ? 'Admin' : 'User'} />
);

export const AccountChip = ({ disabled }: Readonly<{ disabled: boolean }>) => (
  <Chip {...small} color={disabled ? 'error' : 'success'} label={disabled ? 'Disabled' : 'Active'} />
);

export const ResolvedChip = ({ resolved }: Readonly<{ resolved: boolean }>) => (
  <Chip {...small} color={resolved ? 'success' : 'default'} label={resolved ? 'Resolved' : 'Open'} />
);
