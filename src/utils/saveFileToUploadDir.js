import fs from 'node:fs/promises';
import path from 'node:path';

import env from './env.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from '../constants/index.js';

export const saveFileToUploadDir = async (file) => {
  await fs.rename(
    path.join(TEMP_UPLOAD_DIR, file.filename),
    path.join(UPLOAD_DIR, file.filename),
  );

  return `${env('FRONTEND_DOMAIN')}/upload/${file.filename}`;
};
