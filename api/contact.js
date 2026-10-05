// POST /api/contact — contact form → email to the workshop (reply-to = sender)
// Body (JSON): { name, email, topic, message, website (honeypot, must be empty), locale }
'use strict';

const config = require('../src/site.config.js');
const { sendEmail, template, textVersion } = require('./_lib/email.js');

const TOPICS = { general: 'General question', order: 'Existing order', custom: 'Custom design', trade: 'Trade / project enquiry' };

// Very small in-memory rate limit (per warm function instance): 5 messages / 10 min / IP
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  const arr = (hits.get(ip) || []).filter(t => now - t < 10 * 60 * 1000);
  arr.push(now); hits.set(ip, arr);
  return arr.length > 5;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed' }); }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON' }); } }
  body = body || {};

  // Honeypot: bots fill every field
  if (String(body.website || '').trim()) return res.status(200).json({ ok: true });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown';
  if (limited(ip)) return res.status(429).json({ error: 'Too many messages, please try again later' });

  const name = String(body.name || '').trim().slice(0, 120);
  const email = String(body.email || '').trim().slice(0, 160);
  const message = String(body.message || '').trim().slice(0, 4000);
  const topic = TOPICS[body.topic] ? body.topic : 'general';
  const locale = body.locale === 'tr' ? 'tr' : 'en';
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please fill in your name, a valid email and a message' });

  const msg = {
    title: `${TOPICS[topic]} from ${name}`,
    intro: `Via the contact form (${locale.toUpperCase()}). Reply to this email to answer ${name} directly.`,
    rows: [['Name', name], ['Email', email], ['Topic', TOPICS[topic]], ['IP', ip]],
    paragraphs: message.split(/\n{2,}/)
  };
  const result = await sendEmail({
    to: config.contact.notifyEmail,
    replyTo: email,
    subject: `✉️ ${TOPICS[topic]}: ${name}`,
    html: template(msg), text: textVersion(msg),
    tags: [{ name: 'type', value: 'contact' }]
  });
  if (result && result.error) return res.status(502).json({ error: 'Email delivery failed' });
  return res.status(200).json({ ok: true });
};
