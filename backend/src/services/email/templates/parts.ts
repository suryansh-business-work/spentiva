import type { EntryRow, MonthRow, ShareRow } from '../reportData.js';
import { BRAND, esc } from './layout.js';

export type Money = (amount: number) => string;

export interface Tile {
  label: string;
  value: string;
  color: string;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/* Inline table styles (mail clients ignore <style> blocks in many places) */
const cell = (extra = '') => `padding:9px 0;border-bottom:1px solid ${BRAND.line};${extra}`;
const th = (align: 'left' | 'right') => cell(`color:${BRAND.sub};font-weight:600;text-align:${align}`);
const strongNumber = (color: string) => cell(`text-align:right;white-space:nowrap;vertical-align:top;font-weight:700;color:${color}`);
const NUMBER = cell('text-align:right;white-space:nowrap');
const WHEN = cell(`color:${BRAND.sub};white-space:nowrap;vertical-align:top;width:64px`);
const WHAT = cell('padding-left:8px;padding-right:8px');
const DOT = 'width:10px;height:10px;border-radius:5px;background:';
const FLAT = 'height:6px;font-size:0;line-height:0;background:';

/** Horizontal share bar built from table cells (renders in every mail client) */
export function bar(percent: number, color: string): string {
  const width = Math.min(100, Math.max(1, Math.round(percent)));
  const filled = `<td width="${width}%" style="${FLAT}${color}">&nbsp;</td>`;
  const rest = width < 100 ? `<td style="${FLAT}${BRAND.track}">&nbsp;</td>` : '';
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${filled}${rest}</tr></table>`;
}

/** KPI tiles side by side (they stack on phones) */
export function statTiles(tiles: Tile[]): string {
  const columns = tiles
    .map(
      (t) => `
      <mj-column padding="4px" inner-background-color="${BRAND.white}" inner-border-radius="18px">
        <mj-text font-size="12px" color="${BRAND.sub}" padding="14px 16px 0">${esc(t.label)}</mj-text>
        <mj-text font-size="20px" line-height="26px" font-weight="800" color="${t.color}" padding="2px 16px 14px">${esc(t.value)}</mj-text>
      </mj-column>`,
    )
    .join('');
  return `
    <mj-section padding="2px 0">${columns}
    </mj-section>`;
}

/** Name · count, amount and share of the total, with a bar per row */
export function shareTable(rows: ShareRow[], money: Money): string {
  const body = rows
    .map(
      (r) => `
            <tr>
              <td style="padding:10px 0 4px;width:16px"><div style="${DOT}${r.color}"></div></td>
              <td style="padding:10px 8px 4px">${esc(r.name)} <span style="color:${BRAND.faint}">· ${plural(r.count, 'entry', 'entries')}</span></td>
              <td style="padding:10px 0 4px;text-align:right;white-space:nowrap;font-weight:700">${esc(money(r.amount))} <span style="color:${BRAND.sub};font-weight:400">${Math.round(r.percent)}%</span></td>
            </tr>
            <tr><td colspan="3" style="padding:0 0 6px;border-bottom:1px solid ${BRAND.line}">${bar(r.percent, r.color)}</td></tr>`,
    )
    .join('');
  return `
          <mj-table>${body}
          </mj-table>`;
}

/** Income, spending and net for each month of the period */
export function monthTable(rows: MonthRow[], money: Money): string {
  const head = ['Month', 'Income', 'Spent', 'Net'].map((h, i) => `<th style="${th(i === 0 ? 'left' : 'right')}">${h}</th>`).join('');
  const body = rows
    .map((r) => {
      const net = r.income - r.expense;
      return `
            <tr>
              <td style="${cell()}">${esc(r.label)}</td>
              <td style="${NUMBER}">${esc(money(r.income))}</td>
              <td style="${NUMBER}">${esc(money(r.expense))}</td>
              <td style="${strongNumber(net < 0 ? BRAND.red : BRAND.greenDark)}">${esc(money(net))}</td>
            </tr>`;
    })
    .join('');
  return `
          <mj-table>
            <tr>${head}</tr>${body}
          </mj-table>`;
}

/** Time/date, what it was (plus note, payment mode, who) and the signed amount */
export function entryTable(rows: EntryRow[], money: Money): string {
  const body = rows
    .map((r) => {
      const sign = r.income ? '+' : '−';
      const detail = r.detail ? `<br /><span style="color:${BRAND.sub};font-size:12px">${esc(r.detail)}</span>` : '';
      return `
            <tr>
              <td style="${WHEN}">${esc(r.when)}</td>
              <td style="${WHAT}">${esc(r.title)}${detail}</td>
              <td style="${strongNumber(r.income ? BRAND.green : BRAND.ink)}">${sign}${esc(money(r.amount))}</td>
            </tr>`;
    })
    .join('');
  return `
          <mj-table>${body}
          </mj-table>`;
}
