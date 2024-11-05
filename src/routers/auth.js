import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  loginSchema,
  registerSchema,
  requestResetEmailSchema,
  resetPasswordValidationSchema,
  // resetPasswordValidationSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  loginController,
  logoutController,
  refreshController,
  registerController,
  requestResetEmailController,
  resetPasswordController,
  // resetPasswordController,
} from '../controllers/auth.js';
const router = express.Router();
const jsonParser = express.json();

router.post(
  '/register',
  jsonParser,
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  jsonParser,
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

router.post('/logout', ctrlWrapper(logoutController));
router.post('/refresh', ctrlWrapper(refreshController));

router.post(
  '/send-reset-email',
  jsonParser,
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);
router.post(
  '/reset-password',
  jsonParser,
  validateBody(resetPasswordValidationSchema),
  ctrlWrapper(resetPasswordController),
);
export default router;
