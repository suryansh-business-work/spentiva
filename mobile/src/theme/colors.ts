/** Brand colours from the UX reference (lime + deep green, soft neutrals) */
export const C = {
  lime: '#DDF5B3',
  limeStrong: '#C7EE82',
  limeSoft: '#EEF9DA',
  green: '#5DA314',
  greenDark: '#3F7D0B',
  ink: '#151515',
  sub: '#6E6E6E',
  faint: '#A3A3A3',
  bg: '#F4F5F1',
  card: '#FFFFFF',
  line: '#ECEDE8',
  pill: '#ECEEE8',
  track: '#EEF0EA',
  red: '#E5484D',
  redSoft: '#FDECEC',
  income: '#B5E36C',
  expense: '#4E9A0E',
  white: '#FFFFFF',
} as const;

/** 8-digit hex with alpha, e.g. tint('#5DA314', 0.15) */
export function tint(hex: string, alpha: number) {
  const a = Math.round(Math.min(1, Math.max(0, alpha)) * 255)
    .toString(16)
    .padStart(2, '0');
  return /^#[0-9a-f]{6}$/i.test(hex) ? `${hex}${a}` : hex;
}
