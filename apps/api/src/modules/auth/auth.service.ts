import bcrypt from "bcryptjs";
import { AppError } from "../../common/app-error.js";
import { prisma } from "../../db/prisma.js";
import type { LoginInput, RegisterInput } from "@rs-flow/shared";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./auth.tokens.js";

const SALT_ROUNDS = 12;

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw AppError.conflict("An account with this email already exists");
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const user = await prisma.user.create({
    data: { email: input.email, passwordHash, name: input.name },
  });

  return issueTokensForUser(user.id, user.email, user.name);
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw AppError.unauthorized("Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw AppError.unauthorized("Invalid email or password");
  }

  return issueTokensForUser(user.id, user.email, user.name);
}

export async function getUserById(id: string) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw AppError.unauthorized("Session user no longer exists");
  }
  return { id: user.id, email: user.email, name: user.name };
}

export async function refreshSession(refreshToken: string) {
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) {
    throw AppError.unauthorized("Invalid or expired refresh token");
  }

  return issueTokensForUser(user.id, user.email, user.name);
}

function issueTokensForUser(id: string, email: string, name: string) {
  const accessToken = signAccessToken({ sub: id, email });
  const refreshToken = signRefreshToken({ sub: id, email });
  return { accessToken, refreshToken, user: { id, email, name } };
}
