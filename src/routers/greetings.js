import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getGreetingsController } from '../controllers/controllerGreetings.js';
const router = express.Router();
export default router;
router.get('/', ctrlWrapper(getGreetingsController));
