import Typography from '@mui/material/Typography';
import { LevelChip, ResolvedChip, SourceChip } from '@/components/chips';
import type { Column } from '@/components/DataTable';
import type { LogRowFieldsFragment } from '@/gql/graphql';
import { formatDate, timeAgo, type Display } from '@/lib/format';

export type LogRow = LogRowFieldsFragment;

const clamp = { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', wordBreak: 'break-word' } as const;

const appOf = (l: LogRow) => [l.appVersion ? `v${l.appVersion}` : null, l.platform].filter(Boolean).join(' · ') || '—';

/** When · level · source · what · who · where · app build · status */
export const logColumns = (display: Display): Column<LogRow>[] => [
  {
    id: 'occurredAt',
    label: 'When',
    sortable: true,
    width: 170,
    render: (l) => (
      <>
        <Typography variant="body2">{formatDate(l.occurredAt, display, 'dateTimeSeconds')}</Typography>
        <Typography variant="caption" color="text.secondary">
          {timeAgo(l.occurredAt)}
        </Typography>
      </>
    ),
  },
  { id: 'level', label: 'Level', sortable: true, render: (l) => <LevelChip level={l.level} /> },
  { id: 'source', label: 'Source', sortable: true, hideBelow: 'md', render: (l) => <SourceChip source={l.source} /> },
  {
    id: 'message',
    label: 'What happened',
    render: (l) => (
      <Typography variant="body2" sx={{ ...clamp, minWidth: 220, maxWidth: 480 }}>
        {l.message}
      </Typography>
    ),
  },
  {
    id: 'user',
    label: 'Who',
    hideBelow: 'sm',
    render: (l) => (
      <Typography variant="body2" color={l.userEmail ? 'text.primary' : 'text.secondary'} sx={{ wordBreak: 'break-all' }}>
        {l.userEmail ?? 'Not signed in'}
      </Typography>
    ),
  },
  {
    id: 'url',
    label: 'Where',
    hideBelow: 'md',
    render: (l) => (
      <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: 12, wordBreak: 'break-all', maxWidth: 240 }}>
        {l.url ?? '—'}
      </Typography>
    ),
  },
  {
    id: 'appVersion',
    label: 'App',
    sortable: true,
    hideBelow: 'lg',
    render: (l) => (
      <>
        <Typography variant="body2">{appOf(l)}</Typography>
        {l.device ? (
          <Typography variant="caption" color="text.secondary" sx={{ ...clamp, WebkitLineClamp: 1, maxWidth: 200 }}>
            {l.device}
          </Typography>
        ) : null}
      </>
    ),
  },
  { id: 'resolved', label: 'Status', hideBelow: 'sm', render: (l) => <ResolvedChip resolved={l.resolved} /> },
];
