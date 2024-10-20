import createHttpError from 'http-errors';
import {
  postContacts,
  getAllContacts,
  getContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';

export async function getContactsController(req, res) {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);

  const data = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    // parentId: req.user._id,
  });
  res.json({
    status: 200,
    message: 'Sucessfully found contacts!',
    data,
  });
}
export async function getContactController(req, res, next) {
  const { id } = req.params;
  const data = await getContact(id);
  if (data === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }
  // if (data.parentId.toString() !== req.user._id.toString()) {
  //   return next(createHttpError.NotFound('Contact not found'));
  // }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
}

export async function postContactsController(req, res, next) {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Перевірка обов'язкових полів
    if (!name || !phoneNumber || !contactType) {
      return next(
        new createHttpError(
          400,
          'Missing required fields: name, phoneNumber, and contactType are required',
        ),
      );
    }

    // Виклик сервісу для створення контакту
    const data = await postContacts({
      name,
      phoneNumber,
      email,
      isFavourite: isFavourite || false, // За замовчуванням false, якщо не передано
      contactType,
      // userId: req.user._id,
    });

    // Відповідь з кодом 201 та даними створеного контакту
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteContactController(req, res, next) {
  const { id } = req.params;
  const data = await deleteContact(id);

  if (data === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }
  res.status(204).json();
}
export async function patchContactController(req, res, next) {
  const { id } = req.params;

  const editcontact = await updateContact(id, req.body);

  if (editcontact === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: editcontact,
  });
}
