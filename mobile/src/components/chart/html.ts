import { CHART_JS_SOURCE } from './chartjs.generated';
import type { ChartSpec } from './types';

/** Builds the Chart.js config inside the WebView (functions can't cross the bridge as JSON) */
const BOOT = `
(function () {
  var s = window.__SPEC__;
  function fmt(v, compact) {
    try {
      return new Intl.NumberFormat(s.locale, { style: 'currency', currency: s.currency,
        notation: compact ? 'compact' : 'standard', maximumFractionDigits: compact ? 1 : 0 }).format(v);
    } catch (e) { return s.currency + ' ' + Math.round(v); }
  }
  function alpha(hex, a) { return /^#[0-9a-f]{6}$/i.test(hex) ? hex + Math.round(a * 255).toString(16).padStart(2, '0') : hex; }
  Chart.defaults.font.family = '-apple-system, Roboto, "Segoe UI", Helvetica, Arial, sans-serif';
  Chart.defaults.font.size = 11;
  Chart.defaults.color = s.textColor || '#7A7A7A';
  var round = s.type === 'doughnut' || s.type === 'pie';
  var horizontal = s.type === 'barH';
  var type = horizontal ? 'bar' : s.type;
  var n = s.datasets.length;
  var datasets = s.datasets.map(function (d, i) {
    var color = d.color || '#5DA314';
    var bg = d.colors && d.colors.length ? d.colors : color;
    var ds = { label: d.label, data: d.data, backgroundColor: bg, borderColor: round ? '#ffffff' : color, borderWidth: round ? 2 : 0 };
    if (type === 'bar') {
      ds.borderRadius = horizontal ? 6 : 8;
      ds.borderSkipped = false;
      ds.maxBarThickness = horizontal ? 16 : 22;
      if (s.overlap) { ds.grouped = false; ds.order = n - i; ds.barPercentage = 0.55; }
    }
    if (type === 'line') {
      ds.tension = 0.35; ds.fill = true; ds.backgroundColor = alpha(color, 0.15);
      ds.pointRadius = 0; ds.pointHitRadius = 12; ds.borderWidth = 2.5;
    }
    if (round) { ds.borderRadius = 6; ds.spacing = 1; ds.hoverOffset = 6; }
    return ds;
  });
  var options = {
    responsive: true, maintainAspectRatio: false, animation: { duration: 550, easing: 'easeOutCubic' },
    indexAxis: horizontal ? 'y' : 'x',
    layout: { padding: round ? 6 : { top: 6, right: 6, left: 0, bottom: 0 } },
    plugins: {
      legend: { display: !!s.legend, position: 'bottom',
        labels: { usePointStyle: true, pointStyle: 'circle', boxWidth: 7, boxHeight: 7, padding: 12, color: '#555' } },
      tooltip: {
        backgroundColor: '#151515', padding: 10, cornerRadius: 10, displayColors: round || n > 1,
        callbacks: {
          label: function (ctx) {
            var v = typeof ctx.parsed === 'object' ? (horizontal ? ctx.parsed.x : ctx.parsed.y) : ctx.parsed;
            var name = round ? ctx.label : (n > 1 ? ctx.dataset.label : '');
            return ' ' + (name ? name + ': ' : '') + fmt(v);
          }
        }
      }
    }
  };
  if (round) {
    options.cutout = s.type === 'doughnut' ? '68%' : 0;
  } else {
    var value = { beginAtZero: true, grid: { color: s.gridColor || '#E9E9E4', drawTicks: false },
      border: { display: false, dash: [4, 4] }, ticks: { padding: 6, maxTicksLimit: 5, callback: function (v) { return fmt(v, true); } } };
    var cat = { grid: { display: false }, border: { display: false }, ticks: { padding: 4, autoSkip: true, maxRotation: 0 } };
    options.scales = horizontal ? { x: value, y: cat } : { x: cat, y: value };
  }
  new Chart(document.getElementById('c'), { type: type, data: { labels: s.labels, datasets: datasets }, options: options });
})();`;

export function buildHtml(spec: ChartSpec) {
  const json = JSON.stringify(spec).replace(/</g, '\\u003c');
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>html,body{margin:0;padding:0;background:transparent;overflow:hidden;-webkit-tap-highlight-color:transparent}#w{position:absolute;inset:0}</style></head>
<body><div id="w"><canvas id="c"></canvas></div><script>${CHART_JS_SOURCE}</script><script>window.__SPEC__=${json};${BOOT}</script></body></html>`;
}
