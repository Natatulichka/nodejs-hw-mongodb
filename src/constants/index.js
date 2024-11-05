import path from 'node:path';
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// export const ACCESS_TOKEN_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds;
export const ACCESS_TOKEN_TTL = 24 * 60 * 60 * 1000; // 1 day in milliseconds;
export const REFRESH_TOKEN_TTL = 24 * 60 * 60 * 1000; // 1 day in milliseconds;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const JWT_SECRET = 'JWT_SECRET';

export const DOMAIN = {
  FRONTEND_DOMAIN: 'FRONTEND_DOMAIN',
  BACKEND_DOMAIN: 'BACKEND_DOMAIN',
};

export const TEMPLATES_PATH = path.join(process.cwd(), 'src', 'templates');
