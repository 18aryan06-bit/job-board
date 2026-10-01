import nodemailer from 'nodemailer';

const t = process.env.SMTP_HOST
  ? nodemailer.createTransport({ host: process.env.SMTP_HOST, port: +process.env.SMTP_PORT || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } })
  : null;

export async function sendMail(to, subject, text) {
  try {
    if (!t) return console.log(`[MOCK EMAIL] To: ${to}\nSubject: ${subject}\n${text}\n`);
    await t.sendMail({ from: '"JobBoard" <no-reply@jobboard.com>', to, subject, text });
  } catch (e) { console.error('Email failed:', e.message); }
}
