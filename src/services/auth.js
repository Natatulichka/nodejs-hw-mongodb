import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import env from '../utils/env.js';

import { Session } from '../db/models/session.js';
import User from '../db/models/user.js';
import {
  ACCESS_TOKEN_TTL,
  // DOMAIN,
  // JWT_SECRET,
  REFRESH_TOKEN_TTL,
  // SMTP,
} from '../constants/index.js';

export async function registerUser(payload) {
  const maybeUser = await User.findOne({ email: payload.email });

  if (maybeUser !== null) {
    throw createHttpError(409, 'Email already in user');
  }

  payload.password = await bcrypt.hash(payload.password, 10);

  return User.create(payload);
}

export async function loginUser(email, password) {
  const maybeUser = await User.findOne({ email });

  if (maybeUser === null) {
    throw createHttpError(404, 'User not found');
  }

  const isMatch = await bcrypt.compare(password, maybeUser.password);

  if (isMatch === false) {
    throw createHttpError(401, 'Unauthorized');
  }

  await Session.deleteOne({ userId: maybeUser._id });

  return Session.create({
    userId: maybeUser._id,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

export function logoutUser(sessionId) {
  return Session.deleteOne({ _id: sessionId });
}

export async function refreshUserSession(sessionId, refreshToken) {
  const session = await Session.findOne({ _id: sessionId, refreshToken });

  if (session === null) {
    throw createHttpError(401, 'Session not found');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw createHttpError(401, 'Refresh token is expired');
  }

  await Session.deleteOne({ _id: sessionId });

  return Session.create({
    userId: session.userId,
    accessToken: crypto.randomBytes(30).toString('base64'),
    refreshToken: crypto.randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
}

export async function requestResetToken(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  console.log('Sending reset password email to:', user.email);
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    // {
    //   expiresIn: 5 * 60, //5 minutes,
    // },
  );
  console.log(resetToken);

  // const resetLink = `${env(
  //   DOMAIN.FRONTEND_DOMAIN,
  // )}/auth/reset-password?token=${resetToken}`;

  // try {
  //   await sendMail({
  //     to: email,
  //     from: env(SMTP.SMTP_FROM),
  //     html: generateResetPasswordEmail({
  //       name: user.name,
  //       resetLink: resetLink,
  //     }),
  //     subject: 'Reset your password!',
  //   });
  // } catch (err) {
  //   console.log(err);
  //   throw createHttpError(
  //     500,
  //     'Failed to send the email, please try again later.',
  //   );
  // }
}

// export const resetPassword = async ({ token, password }) => {
//   let payload;
//   try {
//     payload = jwt.verify(token);
//     // payload = jwt.verify(token, env(JWT_SECRET));
//   } catch {
//     throw createHttpError(401, 'Token is expired or invalid.');
//   }
//   const user = await User.findById(payload.sub);

//   if (!user) {
//     throw createHttpError(404, 'User not found!');
//   }

//   // Перевірка чи новий пароль відрізняється від старого
//   const isSamePassword = await bcrypt.compare(password, user.password);
//   if (isSamePassword) {
//     throw createHttpError(
//       400,
//       'New password must be different from the old one.',
//     );
//   }

//   const hashedPassword = await bcrypt.hash(password, 10);

//   await User.findByIdAndUpdate(user._id, { password: hashedPassword });

//   // Видалення сесій після зміни пароля
//   await Session.deleteOne({ userId: user._id });
// };
