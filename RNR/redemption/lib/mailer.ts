import nodemailer from "nodemailer";

export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  // Create a transporter using SMTP or your email provider
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Send mail
  await transporter.sendMail({
    from: `"Redemption App" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
  });
}
