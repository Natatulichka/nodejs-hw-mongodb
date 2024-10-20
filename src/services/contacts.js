import { Contact } from '../db/models/contacts.js';

export async function getAllContacts({
  filter,
  page,
  perPage,
  sortBy,
  sortOrder,
}) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contactQuery = Contact.find();
  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }
  if (filter.isFavourite !== undefined) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }
  // contactQuery.where('parentId').equals(parentId);
  // Запит для підрахунку загальної кількості контактів
  const [total, data] = await Promise.all([
    Contact.countDocuments(contactQuery),
    contactQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);
  const totalPages = Math.ceil(total / perPage);

  return {
    data,
    totalItems: total,
    page,
    perPage,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

export function getContact(id) {
  return Contact.findById(id);
}

export function postContacts(payload) {
  return Contact.create(payload);
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
