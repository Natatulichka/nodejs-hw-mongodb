import createHttpError from 'http-errors';
import {
  postContacts,
  getAllContacts,
  getContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';

export async function getContactsController(reg, res) {
  const contacts = await getAllContacts();
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
    return next(new createHttpError.NotFound('Student not found'));
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data: contact,
  });
}

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
  const { id } = req.params;
  const contact = await deleteContact(id);

  if (contact === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Student deleted successfully',
    data: contact,
  });
};

// export const patchContactController = async (req, res, next) => {
//   const { id } = req.params;
//   const result = await changeContact(id, req.body);

//   if (result === null) {
//     return next(new createHttpError.NotFound('Contact not found'));
//   }

//   res.json({
//     status: 200,
//     message: 'Successfully updated a contact!',
//     data: result,
//   });
// };

export async function patchContactController(req, res, next) {
  const { id } = req.params;

  const result = await updateContact(id, req.body);

  if (result === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }

  res.json({
    status: 200,
    message: 'Contact updated successfully',
    data: result,
  });
}
