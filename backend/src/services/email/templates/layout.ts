/** Spentiva brand colours (same palette as the app) */
export const BRAND = {
  lime: '#DDF5B3',
  green: '#5DA314',
  greenDark: '#3F7D0B',
  ink: '#151515',
  sub: '#6E6E6E',
  faint: '#A3A3A3',
  bg: '#F4F5F1',
  line: '#ECEDE8',
  track: '#EEF0EA',
  red: '#E5484D',
  white: '#FFFFFF',
} as const;

const FONT = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const ENTITIES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };

/** Escape text (names, notes, categories…) before it goes into MJML/HTML */
export const esc = (value: string) => value.replaceAll(/[&<>"']/g, (c) => ENTITIES[c] ?? c);

export interface LayoutParts {
  /** <title> and the inbox preview line */
  title: string;
  preview: string;
  /** Lime header: small label, big heading, sub line (plain text, escaped here) */
  eyebrow: string;
  heading: string;
  subheading: string;
  /** MJML sections (mj-wrapper / mj-section) */
  body: string;
  /** Small print under the content (plain text) */
  footer: string;
}

/** White rounded card with space around it */
export const card = (content: string) => `
    <mj-wrapper padding="6px 0">
      <mj-section background-color="${BRAND.white}" border-radius="20px" padding="18px 20px">
        <mj-column>${content}
        </mj-column>
      </mj-section>
    </mj-wrapper>`;

export function cardTitle(title: string, caption?: string): string {
  const heading = `
          <mj-text font-size="16px" font-weight="700" padding="0 0 ${caption ? 2 : 10}px">${esc(title)}</mj-text>`;
  if (!caption) return heading;
  return `${heading}
          <mj-text font-size="12px" color="${BRAND.sub}" padding="0 0 10px">${esc(caption)}</mj-text>`;
}

/** The shell every Spentiva email uses: wordmark, lime header, content, footer */
export function layout(parts: LayoutParts): string {
  return `<mjml>
  <mj-head>
    <mj-title>${esc(parts.title)}</mj-title>
    <mj-preview>${esc(parts.preview)}</mj-preview>
    <mj-attributes>
      <mj-all font-family="${FONT}" />
      <mj-text font-size="14px" line-height="21px" color="${BRAND.ink}" padding="0" />
      <mj-table font-size="13px" line-height="19px" color="${BRAND.ink}" padding="0" cellpadding="0" cellspacing="0" />
    </mj-attributes>
  </mj-head>
  <mj-body background-color="${BRAND.bg}" width="600px">
    <mj-section padding="24px 12px 10px">
      <mj-column>
        <mj-text font-size="20px" font-weight="800" letter-spacing="-0.4px">Spentiva<span style="color:${BRAND.green}">.</span></mj-text>
      </mj-column>
    </mj-section>
    <mj-wrapper padding="0 0 6px">
      <mj-section background-color="${BRAND.lime}" border-radius="24px" padding="22px 20px">
        <mj-column>
          <mj-text font-size="12px" font-weight="700" color="${BRAND.greenDark}" text-transform="uppercase" letter-spacing="1px">${esc(parts.eyebrow)}</mj-text>
          <mj-text font-size="26px" line-height="32px" font-weight="800" padding="6px 0 0">${esc(parts.heading)}</mj-text>
          <mj-text color="${BRAND.sub}" padding="4px 0 0">${esc(parts.subheading)}</mj-text>
        </mj-column>
      </mj-section>
    </mj-wrapper>${parts.body}
    <mj-section padding="18px 12px 32px">
      <mj-column>
        <mj-text font-size="12px" line-height="18px" color="${BRAND.faint}" align="center">${esc(parts.footer)}</mj-text>
      </mj-column>
    </mj-section>
  </mj-body>
</mjml>`;
}
