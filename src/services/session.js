import { randomBytes } from 'node:crypto';

import Session from '../db/models/session.js';
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from '../constants/index.js';

export const findSession = (filter) => Session.findOne(filter);

export async function createSession(userId) {
  await Session.deleteOne({ userId });

  const session = await Session.create({
    userId,
    accessToken: randomBytes(30).toString('base64'),
    refreshToken: randomBytes(30).toString('base64'),
    accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_TTL),
    refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });
  // Повертаємо сесію, включаючи токени
  return {
    accessToken: session.accessToken,
    refreshToken: session.refreshToken,
    sessionId: session._id.toString(),
  };
}

export const deleteSession = (filter) => Session.deleteOne(filter);
