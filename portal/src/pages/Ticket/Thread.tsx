import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { TicketDetailFieldsFragment } from '@/gql/graphql';
import { formatDate, type Display } from '@/lib/format';

type Message = TicketDetailFieldsFragment['messages'][number];

function Bubble({ message, display }: Readonly<{ message: Message; display: Display }>) {
  const admin = message.author === 'ADMIN';
  return (
    <Box sx={{ display: 'flex', justifyContent: admin ? 'flex-end' : 'flex-start' }}>
      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          maxWidth: { xs: '92%', sm: '75%' },
          bgcolor: admin ? 'primary.main' : 'background.paper',
          color: admin ? 'primary.contrastText' : 'text.primary',
          borderColor: admin ? 'primary.main' : 'divider',
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mb: 0.5 }}>
          {`${message.authorName}${admin ? ' (support)' : ''} · ${formatDate(message.createdAt, display)}`}
        </Typography>
        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {message.body}
        </Typography>
      </Paper>
    </Box>
  );
}

/** The conversation between the user and support, oldest first */
export function Thread({ messages, display }: Readonly<{ messages: Message[]; display: Display }>) {
  return (
    <Stack spacing={1.5} component="ol" aria-label="Conversation" sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {messages.map((m) => (
        <li key={m.id}>
          <Bubble message={m} display={display} />
        </li>
      ))}
    </Stack>
  );
}
