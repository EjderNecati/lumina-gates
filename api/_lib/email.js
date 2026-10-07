// Transactional email via Resend (https://resend.com) - plain HTTPS, no SDK.
//
// Env: RESEND_API_KEY   (if missing, emails are logged instead of sent)
//      EMAIL_FROM       e.g. "Lumina Gates <orders@luminagates.com>" (domain must be verified in Resend)
'use strict';

const config = require('../../src/site.config.js');

async function sendEmail({ to, subject, html, text, replyTo, tags }) {
  const key = process.env.RESEND_API_KEY;
  const payload = {
    from: config.contact.fromEmail,
    to: Array.isArray(to) ? to : [to],
    subject, html, text,
    ...(replyTo ? { reply_to: replyTo } : {}),
    ...(tags ? { tags } : {})
  };
  if (!key) {
    console.log('[email skipped: RESEND_API_KEY not set]', JSON.stringify({ to: payload.to, subject }));
    return { skipped: true };
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error('[email failed]', res.status, JSON.stringify(body));
    return { error: body };
  }
  return body;
}

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** Minimal branded HTML wrapper. `rows` = [[label, value]], `paragraphs` = strings (already plain text). */
function template({ title, intro, rows = [], paragraphs = [], footer }) {
  const table = rows.length ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
      ${rows.map(([k, v]) => `<tr><td style="padding:8px 0;border-bottom:1px solid #e8e2d6;color:#5A5A56;width:40%;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;border-bottom:1px solid #e8e2d6;color:#0E0E0E;vertical-align:top">${esc(v)}</td></tr>`).join('')}
    </table>` : '';
  return `<!doctype html><html><body style="margin:0;background:#F6F2EA;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:#0E0E0E">
  <div style="max-width:560px;margin:0 auto;padding:32px 20px">
    <div style="font-family:Georgia,'Times New Roman',serif;font-size:26px;letter-spacing:.08em;margin-bottom:4px">LUMINA</div>
    <div style="font-size:10px;letter-spacing:.3em;text-transform:uppercase;color:#5A5A56;margin-bottom:28px">Gates Atelier</div>
    <h1 style="font-family:Georgia,'Times New Roman',serif;font-weight:500;font-size:26px;margin:0 0 12px">${esc(title)}</h1>
    ${intro ? `<p style="font-size:15px;line-height:1.6;margin:0 0 8px">${esc(intro)}</p>` : ''}
    ${table}
    ${paragraphs.map(p => `<p style="font-size:14px;line-height:1.7;color:#2A2A2A;margin:0 0 12px">${esc(p)}</p>`).join('')}
    <p style="font-size:12px;color:#5A5A56;margin-top:32px;border-top:1px solid #e8e2d6;padding-top:16px">${esc(footer || `${config.brand} · ${config.company.legalName} · ${config.siteUrl.replace(/^https?:\/\//, '')}`)}</p>
  </div></body></html>`;
}

function textVersion({ title, intro, rows = [], paragraphs = [], footer }) {
  return [title, '', intro, '', ...rows.map(([k, v]) => `${k}: ${v}`), '', ...paragraphs, '', footer || `${config.brand} · ${config.siteUrl}`].filter(s => s !== undefined).join('\n');
}

module.exports = { sendEmail, template, textVersion };
