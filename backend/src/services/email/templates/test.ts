import { BRAND, card, cardTitle, esc, layout } from './layout.js';
import type { RenderedEmail } from './report.js';

/** Sent from the portal's Settings → Email to check the SMTP settings */
export function testEmail(name: string): RenderedEmail {
  const mjml = layout({
    title: 'Spentiva email is working',
    preview: 'Your SMTP settings can send Spentiva emails.',
    eyebrow: 'Settings · Email',
    heading: 'Email is working',
    subheading: `Hi ${name}, this is a test from the Spentiva portal.`,
    body: card(`${cardTitle('What happens now')}
          <mj-text color="${BRAND.sub}">${esc(
            'Daily, monthly, quarterly and yearly reports go out from this address to everyone who turns them on in the app (Reports → Email reports).',
          )}</mj-text>`),
    footer: 'You got this because an admin sent a test email from the Spentiva portal.',
  });
  return {
    subject: 'Spentiva: test email',
    mjml,
    text: `Hi ${name}, your SMTP settings can send Spentiva emails. Reports go out to everyone who turns them on in the app.`,
  };
}
