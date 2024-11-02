import { Contact } from '../db/models/contacts.js';

export function getAllContacts() {
  return Contact.find();
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
