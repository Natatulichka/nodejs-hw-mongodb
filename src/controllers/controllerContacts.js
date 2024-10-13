import createHttpError from 'http-errors';
import {
  deleteContact,
  getAllContacts,
  getContactById,
  postContacts,
  updateContact,
} from '../services/contacts.js';

export const getContactsController = async (_, res, next) => {
  const contacts = await getAllContacts();
  res.json({
    status: 200,
    message: 'Sucessfully found contacts!',
    data: contacts,
  });
};
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await getContactById(contactId);
  if (contact === null) {
    // 2. Створюємо та налаштовуємо помилку
    return next(new createHttpError.NotFound('Student not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};
export const postContactsController = async (req, res, next) => {
  try {
    const { name, phoneNumber, email, isFavourite, contactType } = req.body;

    // Перевірка обов'язкових полів
    if (!name || !phoneNumber || !contactType) {
      throw createHttpError(
        400,
        'Missing required fields: name, phoneNumber, and contactType are required',
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
};

export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (contact === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }

  await deleteContact(contactId);

  res.status(204).send();
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);

  if (contact === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }

  const updatedContact = await updateContact(contactId, req.body);

  res.json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: updatedContact,
  });
};
