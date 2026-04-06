import { Resend } from "resend";

function getAppUrl() {
  return (
    process.env.APP_URL?.trim().replace(/\/+$/, "") ||
    "http://localhost:3000"
  );
}

function getEmailFrom() {
  return process.env.AUTH_EMAIL_FROM?.trim() || "";
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

type SendEmailResult = {
  delivered: boolean;
  fallbackUrl?: string;
};

async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  fallbackUrl?: string;
}) {
  const resend = getResendClient();
  const from = getEmailFrom();

  if (!resend || !from) {
    console.warn("[auth-email] Email delivery not configured.", {
      to: params.to,
      subject: params.subject,
      fallbackUrl: params.fallbackUrl,
    });
    return {
      delivered: false,
      fallbackUrl: params.fallbackUrl,
    } satisfies SendEmailResult;
  }

  await resend.emails.send({
    from,
    to: params.to,
    subject: params.subject,
    html: params.html,
  });

  return {
    delivered: true,
    fallbackUrl: params.fallbackUrl,
  } satisfies SendEmailResult;
}

export async function sendEmailVerificationEmail(email: string, token: string) {
  const verificationUrl = `${getAppUrl()}/auth/verify-email?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: "Verify your Off2Zim email",
    fallbackUrl: verificationUrl,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Verify your Off2Zim email</h2>
        <p>Click the button below to verify your email address and finish setting up your Off2Zim account.</p>
        <p style="margin: 24px 0;">
          <a href="${verificationUrl}" style="display: inline-block; background: #ff5630; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 999px; font-weight: 600;">Verify email</a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const resetUrl = `${getAppUrl()}/auth/reset-password?token=${encodeURIComponent(token)}`;

  return sendEmail({
    to: email,
    subject: "Reset your Off2Zim password",
    fallbackUrl: resetUrl,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111827;">
        <h2>Reset your Off2Zim password</h2>
        <p>Click the button below to choose a new password for your Off2Zim account.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="display: inline-block; background: #ff5630; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 999px; font-weight: 600;">Reset password</a>
        </p>
        <p>If the button does not work, copy and paste this link into your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
      </div>
    `,
  });
}
