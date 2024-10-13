import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
  postContactsController,
} from '../controllers/controllerContacts.js';

const router = express.Router();
const jsonParser = express.json({
  type: 'application/json',
});

router.get('/', ctrlWrapper(getContactsController));
router.get('/:id', ctrlWrapper(getContactByIdController));
router.post('/', jsonParser, ctrlWrapper(postContactsController));
router.delete('/:id', ctrlWrapper(deleteContactController));
router.patch('/:id', ctrlWrapper(patchContactController));

export default router;
