import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  deleteContactController,
  getContactController,
  getContactsController,
  patchContactController,
  postContactsController,
} from '../controllers/controllerContacts.js';
import { validateBody } from '../middlewares/validateBody.js';

import isValidId from '../middlewares/isValidId.js';
import {
  contactAddSchema,
  contactUpdateSchema,
} from '../validation/contacts.js';

const router = express.Router();
const jsonParser = express.json({
  type: 'application/json',
});

router.get('/', ctrlWrapper(getContactsController));
router.get('/:id', isValidId, ctrlWrapper(getContactController));
router.post(
  '/',
  jsonParser,
  validateBody(contactAddSchema),
  ctrlWrapper(postContactsController),
);
router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));
router.patch(
  '/:id',
  isValidId,
  jsonParser,
  validateBody(contactUpdateSchema),
  ctrlWrapper(patchContactController),
);

export default router;
