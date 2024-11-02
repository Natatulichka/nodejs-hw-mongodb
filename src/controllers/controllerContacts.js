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

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });
  res.json({
    status: 200,
    message: 'Sucessfully found contacts!',
    data: contacts,
  });
}
export async function getContactController(req, res, next) {
  const { id } = req.params;
  const contact = await getContact(id);
  if (contact === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
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
    const contact = await postContacts({
      name,
      phoneNumber,
      email,
      isFavourite: isFavourite || false, // За замовчуванням false, якщо не передано
      contactType,
    });

    // Відповідь з кодом 201 та даними створеного контакту
    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteContactController(req, res, next) {
  const { id } = req.params;
  const contact = await deleteContact(id);

  if (contact === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }
  res.status(204).send();
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
