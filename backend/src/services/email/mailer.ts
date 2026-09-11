import nodemailer, { type Transporter } from 'nodemailer';
import { badInput } from '../../utils/errors.js';
import { getSetting } from '../appSettings.js';
import { recordServerError } from '../logs.js';

export interface Mail {
  to: string;
  subject: string;
  html: string;
  text: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  user: string | null;
  pass: string | null;
  from: string;
}

const NOT_SET_UP = 'Email is not set up yet. An admin can add the SMTP settings in the portal → Settings → Email.';

/** SMTP settings saved in the portal, each falling back to the server environment */
async function smtpConfig(): Promise<SmtpConfig> {
  const [host, port, user, pass, from] = await Promise.all([
    getSetting('SMTP_HOST'),
    getSetting('SMTP_PORT'),
    getSetting('SMTP_USER'),
    getSetting('SMTP_PASSWORD'),
    getSetting('SMTP_FROM'),
  ]);
  const portNumber = Number.parseInt(port ?? '', 10);
  if (!host || !from || !Number.isInteger(portNumber)) throw badInput(NOT_SET_UP);
  return { host, port: portNumber, user, pass, from };
}

let cached: { key: string; transport: Transporter } | null = null;

function transportFor(config: SmtpConfig): Transporter {
  const key = JSON.stringify(config);
  if (cached?.key !== key) {
    const transport = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      // 465 is implicit TLS; other ports upgrade with STARTTLS
      secure: config.port === 465,
      auth: config.user ? { user: config.user, pass: config.pass ?? '' } : undefined,
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 30_000,
    });
    cached = { key, transport };
  }
  return cached.transport;
}

/** Sends one email; delivery failures land in the portal's Logs and come back as a readable error */
export async function sendMail(mail: Mail): Promise<void> {
  const config = await smtpConfig();
  try {
    await transportFor(config).sendMail({ from: config.from, ...mail });
  } catch (err) {
    recordServerError(err, 'email · send', null, null);
    throw badInput(`Couldn't send the email: ${(err as Error).message}`);
  }
}
