import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useNotify } from './Notify';

/** Monospace block (stack traces, JSON) with a copy button */
export function CodeBlock({ code, label }: Readonly<{ code: string; label: string }>) {
  const notify = useNotify();
  const copy = () =>
    navigator.clipboard.writeText(code).then(
      () => notify.success(`${label} copied`),
      (err: unknown) => notify.error(err),
    );

  return (
    <Box sx={{ position: 'relative' }}>
      <Tooltip title={`Copy ${label.toLowerCase()}`}>
        <IconButton size="small" onClick={copy} aria-label={`Copy ${label.toLowerCase()}`} sx={{ position: 'absolute', top: 4, right: 4 }}>
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Box
        component="pre"
        aria-label={label}
        sx={{
          m: 0,
          p: 1.5,
          pr: 5,
          bgcolor: 'grey.100',
          borderRadius: 1,
          fontSize: 12,
          lineHeight: 1.5,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          maxHeight: 360,
          overflow: 'auto',
        }}
      >
        {code}
      </Box>
    </Box>
  );
}
