import { Contact } from '../db/models/contacts.js';
import calculatePaginationData from '../utils/calculatePaginationData.js';

export async function getAllContacts({
  filter,
  page,
  perPage,
  sortBy,
  sortOrder,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  console.log('Filters:', filter); // Логування фільтрів

  const databaseQuery = Contact.find();
  if (filter.contactType) {
    databaseQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    databaseQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const data = await databaseQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  // Запит для підрахунку загальної кількості контактів
  const totalItems = await Contact.countDocuments(databaseQuery.getQuery());

  const { totalPages, hasNextPage, hasPrevPage } = calculatePaginationData({
    totalItems,
    perPage,
    page,
  });

  return {
    data,
    totalItems,
    page,
    perPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
}

export function getContact(id) {
  return Contact.findById(id);
}

export function postContacts(contact) {
  return Contact.create(contact);
}

export function deleteContact(id) {
  return Contact.findByIdAndDelete(id);
}

export function updateContact(id, payload, options = {}) {
  return Contact.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    ...options,
  });
}
