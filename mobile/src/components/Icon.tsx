import { Children, createElement, isValidElement, memo, type ComponentType, type ReactElement, type ReactNode } from 'react';
import type { IconType } from 'react-icons';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Polyline, Rect } from 'react-native-svg';

/**
 * react-icons renders DOM <svg>, which React Native can't display. Every react-icons
 * component is generated from a small SVG tree, so we read that tree once and render
 * it with react-native-svg. Usage: <Icon as={FiHome} size={20} color="#000" />
 */
const TAGS: Record<string, ComponentType<Record<string, unknown>>> = {
  path: Path as never,
  circle: Circle as never,
  rect: Rect as never,
  line: Line as never,
  polyline: Polyline as never,
  polygon: Polygon as never,
  ellipse: Ellipse as never,
  g: G as never,
};
const SKIP = new Set(['children', 'className', 'style', 'xmlns', 'title', 'height', 'width', 'attr']);
const SHAPE_KEYS = ['d', 'points', 'cx', 'cy', 'r', 'x', 'y', 'x1', 'y1', 'x2', 'y2', 'width', 'height'];

type Tree = { attr: Record<string, unknown>; children: ReactNode };
const cache = new WeakMap<IconType, Tree>();

function readTree(icon: IconType): Tree {
  let tree = cache.get(icon);
  if (!tree) {
    const el = icon({}) as ReactElement<{ attr?: Record<string, unknown>; children?: ReactNode }>;
    tree = { attr: el?.props?.attr ?? {}, children: el?.props?.children ?? null };
    cache.set(icon, tree);
  }
  return tree;
}

function paint(props: Record<string, unknown>, color: string) {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(props)) {
    if (!SKIP.has(k)) out[k] = v === 'currentColor' ? color : v;
  }
  return out;
}

const scalar = (v: unknown) => (typeof v === 'string' || typeof v === 'number' ? String(v) : '');

/** Stable key from the shape's geometry (SVG children have no ids) */
const shapeKey = (type: string, props: Record<string, unknown>) => `${type}:${SHAPE_KEYS.map((k) => scalar(props[k])).join('|')}`;

function convert(node: ReactNode, color: string): ReactNode {
  if (!isValidElement(node) || typeof node.type !== 'string') return null;
  const Tag = TAGS[node.type];
  if (!Tag) return null;
  const props = node.props as Record<string, unknown> & { children?: ReactNode };
  const children = Children.toArray(props.children).map((c) => convert(c, color));
  return createElement(Tag, { key: shapeKey(node.type, props), ...paint(props, color) }, ...children);
}

export interface IconProps {
  as: IconType;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const Icon = memo(function Icon({ as, size = 20, color = '#151515', strokeWidth }: Readonly<IconProps>) {
  const { attr, children } = readTree(as);
  const root = { stroke: color, fill: color, strokeWidth: 0, ...paint(attr, color), ...(strokeWidth === undefined ? {} : { strokeWidth }) };
  return (
    <Svg width={size} height={size} {...root}>
      {Children.toArray(children).map((c) => convert(c, color))}
    </Svg>
  );
});
