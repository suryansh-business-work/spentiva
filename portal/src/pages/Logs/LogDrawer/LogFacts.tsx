import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import { DetailList, type Detail } from '@/components/DetailList';
import type { LogDetailFieldsFragment } from '@/gql/graphql';
import { formatDate, timeAgo, type Display } from '@/lib/format';

type Log = LogDetailFieldsFragment;

const joined = (...parts: (string | null)[]) => parts.filter(Boolean).join(' · ') || null;

function who(log: Log) {
  if (!log.userEmail) return 'Not signed in';
  if (!log.userId) return `${log.userEmail} (account deleted)`;
  return (
    <Link component={RouterLink} to={`/users/${log.userId}`}>
      {log.userEmail}
    </Link>
  );
}

/** Who / when / where / which build / which device — everything needed to reproduce */
export function LogFacts({ log, display }: Readonly<{ log: Log; display: Display }>) {
  const items: Detail[] = [
    { label: 'When', value: `${formatDate(log.occurredAt, display, 'dateTimeSeconds')} (${timeAgo(log.occurredAt)})` },
    { label: 'Who', value: who(log) },
    { label: 'Where', value: log.url },
    { label: 'App version', value: joined(log.appVersion && `v${log.appVersion}`, log.buildNumber && `build ${log.buildNumber}`) },
    { label: 'Platform', value: joined(log.platform, log.osVersion && `OS ${log.osVersion}`) },
    { label: 'Device', value: log.device },
    { label: 'API server', value: log.apiUrl },
    { label: 'IP address', value: log.ip },
    { label: 'User agent', value: log.userAgent },
    { label: 'Received', value: formatDate(log.createdAt, display, 'dateTimeSeconds') },
    { label: 'Resolved', value: log.resolvedAt ? formatDate(log.resolvedAt, display) : 'Not yet' },
  ];
  return <DetailList items={items} />;
}
