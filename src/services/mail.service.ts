import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "localhost",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.EMAIL_FROM!,
    pass: process.env.EMAIL_PASS!
  },
});

export const sendVerificationEmail = async (email: string, token: string) => {
  const url = `http://localhost:3000/api/auth/verify-email/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Verify your email',
    html: `<p>Click <a href="${url}">here</a> to verify your email.</p>`
  });
};

export const sendAdminInvite = async (email: string, token: string) => {
  const url = `http://localhost:3000/api/auth/set-password/${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_FROM!,
    to: email,
    subject: 'Set your password',
    html: `<p><a href="${url}">Click here</a> to set your password and activate your admin account.</p>`
  });
};