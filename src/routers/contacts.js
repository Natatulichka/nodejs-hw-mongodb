import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  deleteContactController,
  getContactController,
  getContactsController,
  patchContactController,
  postContactsController,
} from '../controllers/controllerContacts.js';

const router = express.Router();
const jsonParser = express.json({
  type: 'application/json',
});

router.get('/', ctrlWrapper(getContactsController));
router.get('/:id', ctrlWrapper(getContactController));
router.post('/', jsonParser, ctrlWrapper(postContactsController));
router.delete('/:id', ctrlWrapper(deleteContactController));
router.patch('/:id', jsonParser, ctrlWrapper(patchContactController));

export default router;
