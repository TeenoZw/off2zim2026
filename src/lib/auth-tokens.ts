import crypto from "crypto";
import { prisma } from "@/lib/prisma";

const ONE_HOUR_MS = 1000 * 60 * 60;
const VERIFY_EMAIL_TTL_MS = ONE_HOUR_MS * 24;
const PASSWORD_RESET_TTL_MS = ONE_HOUR_MS;

type AuthTokenKind = "verify-email" | "password-reset";

function buildIdentifier(kind: AuthTokenKind, userId: string) {
  return `${kind}:${userId}`;
}

function extractUserId(identifier: string, kind: AuthTokenKind) {
  const prefix = `${kind}:`;
  return identifier.startsWith(prefix) ? identifier.slice(prefix.length) : null;
}

async function createToken(kind: AuthTokenKind, userId: string, ttlMs: number) {
  const identifier = buildIdentifier(kind, userId);
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + ttlMs);

  await prisma.verificationToken.deleteMany({
    where: { identifier },
  });

  await prisma.verificationToken.create({
    data: {
      identifier,
      token,
      expires,
    },
  });

  return { identifier, token, expires };
}

async function consumeToken(kind: AuthTokenKind, token: string) {
  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return null;
  }

  const userId = extractUserId(record.identifier, kind);
  if (!userId) {
    return null;
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.deleteMany({
      where: { identifier: record.identifier },
    });
    return null;
  }

  await prisma.verificationToken.deleteMany({
    where: { identifier: record.identifier },
  });

  return { userId, identifier: record.identifier };
}

export async function createEmailVerificationToken(userId: string) {
  return createToken("verify-email", userId, VERIFY_EMAIL_TTL_MS);
}

export async function createPasswordResetToken(userId: string) {
  return createToken("password-reset", userId, PASSWORD_RESET_TTL_MS);
}

export async function consumeEmailVerificationToken(token: string) {
  return consumeToken("verify-email", token);
}

export async function consumePasswordResetToken(token: string) {
  return consumeToken("password-reset", token);
}
