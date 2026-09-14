import ArrowBack from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link, useParams } from 'react-router';
import { PriorityChip, TicketStatusChip } from '@/components/chips';
import { useNotify } from '@/components/Notify';
import { PageHeader } from '@/components/PageHeader';
import { ErrorAlert, PageLoader } from '@/components/states';
import { TicketReplyForm } from '@/forms/ticket-reply';
import { useReplyTicket } from '@/hooks/mutations';
import { useRules, useTicket } from '@/hooks/queries';
import { useDisplay } from '@/hooks/useDisplay';
import { Thread } from './Thread';
import { TicketMeta } from './TicketMeta';

/** One support request: the conversation, a reply box and its status / priority */
export default function TicketPage() {
  const { id = '' } = useParams();
  const display = useDisplay();
  const notify = useNotify();
  const rules = useRules();
  const { data, error, isPending, refetch } = useTicket(id);
  const reply = useReplyTicket();

  if (isPending || !rules.data) return <PageLoader />;
  const ticket = data?.supportTicket;
  if (!ticket) return <ErrorAlert error={error ?? new Error('Support request not found')} onRetry={() => refetch()} />;

  return (
    <>
      <PageHeader
        title={ticket.subject}
        subtitle={
          <Stack component="span" direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <TicketStatusChip status={ticket.status} />
            <PriorityChip priority={ticket.priority} />
            <span>{`${ticket.messageCount} message${ticket.messageCount === 1 ? '' : 's'}`}</span>
          </Stack>
        }
        actions={
          <Button component={Link} to="/support" startIcon={<ArrowBack />}>
            All requests
          </Button>
        }
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <CardContent>
              <Stack spacing={3}>
                <Thread messages={ticket.messages} display={display} />
                <div>
                  <Typography variant="h3" component="h2" sx={{ mb: 1.5 }}>
                    Reply
                  </Typography>
                  <TicketReplyForm
                    rules={rules.data.validationRules}
                    currentStatus={ticket.status}
                    error={reply.error}
                    onSubmit={async (body, status) => {
                      await reply.mutateAsync({ id: ticket.id, body, status });
                      notify.success('Reply sent');
                    }}
                  />
                </div>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <TicketMeta ticket={ticket} display={display} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
