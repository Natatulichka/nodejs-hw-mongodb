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
import { Contact } from '../db/models/contacts.js';
import env from '../utils/env.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';

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
    userId: req.user._id,
  });
  res.json({
    status: 200,
    message: 'Sucessfully found contacts!',
    data,
  });
}

export async function getContactController(req, res, next) {
  const { id } = req.params;
  const userId = req.user._id; // Отримуємо ID авторизованого користувача

  const data = await getContact(id, userId);
  if (data === null) {
    return next(createHttpError.NotFound('Contact not found'));
  }
  if (data.userId.toString() !== req.user._id.toString()) {
    return next(createHttpError.NotFound('Contact not found'));
  }
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
    const photo = req.file;
    let photoUrl;

    if (photo) {
      if (env('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }
    // Виклик сервісу для створення контакту
    const newContact = {
      name,
      phoneNumber,
      email,
      isFavourite: isFavourite || false, // За замовчуванням false, якщо не передано
      contactType,
      photo: photoUrl,
      userId: req.user._id, // Додаємо userId з авторизованого користувача
    };

    // Перевірка наявності дублікатів
    const existingContact = await Contact.findOne({
      name,
      phoneNumber,
      email,
      userId: req.user._id, // Перевіряємо, чи контакт належить авторизованому користувачу
    });
    // Якщо контакт вже існує, повертаємо помилку
    if (existingContact) {
      return res.status(409).json({
        message: 'Contact with this name and phone number already exists',
      });
    }
    // Викликаємо сервіс для створення контакту
    const data = await postContacts(newContact);
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
  const userId = req.user._id;

  const data = await deleteContact(id, userId);

  if (data === null) {
    return next(new createHttpError.NotFound('Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Contact deleted successfully',
    data,
  });
}
export async function patchContactController(req, res, next) {
  const { id } = req.params;
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;

  if (photo) {
    if (env('ENABLE_CLOUDINARY') === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }

  // Оновлюємо req.body, щоб додати photoUrl, якщо воно є
  if (photoUrl) {
    req.body.photo = photoUrl;
  }

  const editcontact = await updateContact(id, userId, req.body, {
    new: true, // Повернути оновлений документ
    runValidators: true, // Перевірка валідності перед оновленням
  });

  if (editcontact === null) {
    return next(new createHttpError[404]('Failed to update contact'));
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: editcontact,
  });
}
