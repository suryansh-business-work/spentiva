import mjml2html from 'mjml';

/** MJML → responsive HTML with inlined styles. Templates are ours, so invalid markup is a bug and throws. */
export async function renderMjml(markup: string): Promise<string> {
  const { html, errors } = await mjml2html(markup, { validationLevel: 'strict', keepComments: false, fonts: {} });
  if (errors.length) throw new Error(`Invalid MJML: ${errors.map((e) => e.formattedMessage).join('; ')}`);
  return html;
}
