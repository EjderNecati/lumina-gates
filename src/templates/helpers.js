// Small, dependency-free HTML helpers shared by every template.
'use strict';

const config = require('../site.config.js');

/** HTML-escape a value for text content and attributes. */
function e(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

/** Replace {placeholders} in a copy string. Values are escaped unless already marked raw. */
function fill(str, vars = {}) {
  return String(str ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Escape then fill - the common case for copy with variables. */
function tf(str, vars = {}) {
  const safeVars = {};
  for (const [k, v] of Object.entries(vars)) safeVars[k] = e(v);
  return fill(e(str), safeVars);
}

/** Join class names, skipping falsy. */
function cx(...names) { return names.filter(Boolean).join(' '); }

/** Absolute URL for a site path. */
function abs(path) {
  const base = config.siteUrl.replace(/\/$/, '');
  return path === '/' ? base + '/' : base + path;
}

/** Locale-aware site path: href('tr', '/gates/lux') → '/tr/gates/lux' */
function href(locale, path) {
  const prefix = config.locales.prefix[locale] || '';
  if (path === '/' || path === '') return prefix || '/';
  return prefix + path;
}

/** Format USD without decimals: $1,234 */
function money(n, locale = 'en') {
  const v = Math.round(Number(n) || 0);
  return '$' + v.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US');
}

/** Serialize JSON-LD safely inside <script> (avoid </script> breakouts). */
function jsonLd(obj) {
  const json = JSON.stringify(obj)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
  return `<script type="application/ld+json">${json}</script>`;
}

/** Serialize data for a non-executing <script type="application/json"> (CSP-safe). */
function jsonData(id, obj) {
  const json = JSON.stringify(obj).replace(/</g, '\\u003c');
  return `<script type="application/json" id="${e(id)}">${json}</script>`;
}

/** Strip HTML tags / collapse whitespace - for meta descriptions built from copy. */
function plain(str, max = 155) {
  let s = String(str ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (s.length > max) s = s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…';
  return s;
}

/** inches → cm, rounded */
function inToCm(i) { return Math.round(Number(i) * 2.54); }
/** 1-decimal rounding for inches */
function round1(n) { return Math.round(Number(n) * 10) / 10; }

/** Small numbers as words (0-99) for headline copy. Falls back to digits. */
const WORDS = {
  en: { ones: ['zero','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'], tens: ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'], join: '-' },
  tr: { ones: ['sıfır','bir','iki','üç','dört','beş','altı','yedi','sekiz','dokuz'], tens: ['', 'on','yirmi','otuz','kırk','elli','altmış','yetmiş','seksen','doksan'], join: ' ' }
};
function numberWords(n, locale = 'en') {
  n = Math.round(Number(n));
  const w = WORDS[locale] || WORDS.en;
  if (!isFinite(n) || n < 0 || n > 99) return String(n);
  if (locale === 'tr') { if (n < 10) return w.ones[n]; const t = w.tens[Math.floor(n / 10)], o = n % 10; return o ? `${t} ${w.ones[o]}` : t; }
  if (n < 20) return w.ones[n];
  const t = w.tens[Math.floor(n / 10)], o = n % 10;
  return o ? `${t}${w.join}${w.ones[o]}` : t;
}
function capitalize(s) { return s.charAt(0).toLocaleUpperCase() + s.slice(1); }

module.exports = { e, fill, tf, cx, abs, href, money, jsonLd, jsonData, plain, inToCm, round1, numberWords, capitalize };
