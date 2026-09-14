import type { ReportFrequency } from '../../../models/ReportSchedule.js';
import { formatMoney } from '../../../utils/money.js';
import type { ReportEmailData } from '../reportData.js';
import { BRAND, card, cardTitle, esc, layout } from './layout.js';
import { bar, entryTable, monthTable, shareTable, statTiles, type Money } from './parts.js';

export const FREQUENCY_LABEL: Record<ReportFrequency, string> = {
  DAILY: 'Daily',
  MONTHLY: 'Monthly',
  QUARTERLY: 'Quarterly',
  YEARLY: 'Yearly',
};

export interface RenderedEmail {
  subject: string;
  mjml: string;
  text: string;
}

const percent = (n: number) => `${Math.round(n)}%`;

function comparison(d: ReportEmailData): string {
  if (d.expenseChange === null) return 'Nothing to compare with the period before.';
  const direction = d.expenseChange <= 0 ? 'less' : 'more';
  return `You spent ${percent(Math.abs(d.expenseChange))} ${direction} than the period before.`;
}

function summaryCard(d: ReportEmailData): string {
  const net = d.income - d.expense;
  const rate = d.income > 0 ? `You kept ${percent((net / d.income) * 100)} of your income.` : 'No income was logged in this period.';
  const summary = `${rate} ${comparison(d)}`;
  return card(`${cardTitle('Summary')}
          <mj-text color="${BRAND.sub}">${esc(summary)}</mj-text>`);
}

function budgetCard(budget: number, spent: number, money: Money): string {
  const used = budget > 0 ? (spent / budget) * 100 : 100;
  const left = budget - spent;
  const status = left >= 0 ? `${money(left)} left` : `${money(-left)} over budget`;
  const caption = `${money(spent)} of ${money(budget)} spent (${percent(used)})`;
  return card(`${cardTitle('Monthly budget', caption)}
          <mj-table>
            <tr><td style="padding:0 0 8px">${bar(used, left >= 0 ? BRAND.green : BRAND.red)}</td></tr>
            <tr><td style="font-weight:700;color:${left >= 0 ? BRAND.greenDark : BRAND.red}">${esc(status)}</td></tr>
          </mj-table>`);
}

function sections(d: ReportEmailData, money: Money): string {
  if (d.count === 0) {
    return card(`${cardTitle('Nothing logged')}
          <mj-text color="${BRAND.sub}">No entries in ${esc(d.trackerName)} for this period. Tell the chat “spent 250 on lunch” to log one.</mj-text>`);
  }
  const parts = [summaryCard(d)];
  if (d.budget !== null) parts.push(budgetCard(d.budget, d.expense, money));
  if (d.categories.length) parts.push(card(cardTitle('Where the money went', 'Spending by category') + shareTable(d.categories, money)));
  if (d.sources.length) parts.push(card(cardTitle('Paid with', 'Spending by payment mode') + shareTable(d.sources, money)));
  if (d.months.length > 1) parts.push(card(cardTitle('Month by month') + monthTable(d.months, money)));
  if (d.entries.length) {
    const title = d.entriesAreAll ? 'Entries' : 'Largest expenses';
    parts.push(card(cardTitle(title) + entryTable(d.entries, money)));
  }
  return parts.join('');
}

function plainText(d: ReportEmailData, money: Money, heading: string): string {
  const lines = [
    heading,
    d.rangeLabel,
    '',
    `Income: ${money(d.income)}`,
    `Spent: ${money(d.expense)}`,
    `Net: ${money(d.income - d.expense)}`,
    comparison(d),
    '',
    ...d.categories.map((c) => `${c.name}: ${money(c.amount)} (${percent(c.percent)})`),
  ];
  return lines.join('\n');
}

/** The report email for one tracker and period; `frequency` is set for scheduled reports */
export function reportEmail(d: ReportEmailData, frequency: ReportFrequency | null): RenderedEmail {
  const money: Money = (n) => formatMoney(n, d.currency, d.locale, Math.abs(n) >= 1000 ? 0 : 2);
  const kind = frequency ? `${FREQUENCY_LABEL[frequency]} report` : 'Report';
  const net = d.income - d.expense;
  const footer = frequency
    ? `You get this ${FREQUENCY_LABEL[frequency].toLowerCase()} report because you turned it on for “${d.trackerName}” in Spentiva (Reports → Email reports). Amounts are in ${d.currency}.`
    : `You asked for this report in Spentiva. Amounts are in ${d.currency}.`;
  const entries = d.count === 1 ? '1 entry' : `${d.count} entries`;
  const mjml = layout({
    title: `${d.trackerName} · ${d.periodLabel}`,
    preview: `Spent ${money(d.expense)} · earned ${money(d.income)} · net ${money(net)}`,
    eyebrow: `${d.trackerName} · ${kind}`,
    heading: d.periodLabel,
    subheading: d.count ? `${entries} · ${d.rangeLabel}` : d.rangeLabel,
    body:
      statTiles([
        { label: 'Income', value: money(d.income), color: BRAND.green },
        { label: 'Spent', value: money(d.expense), color: BRAND.ink },
        { label: 'Net', value: money(net), color: net < 0 ? BRAND.red : BRAND.greenDark },
      ]) + sections(d, money),
    footer,
  });
  return { subject: `${d.trackerName}: ${d.periodLabel} report`, mjml, text: plainText(d, money, `${d.trackerName} · ${kind} · ${d.periodLabel}`) };
}
