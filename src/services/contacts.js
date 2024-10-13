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

// export const changeContact = async (id, payload) => {
//   const contact = await Contact.findOneAndUpdate(
//     {
//       _id: id,
//     },
//     payload,
//     { new: true },
//   );
//   return contact;
// };
export function updateContact(id, payload) {
  return Contact.findByIdAndUpdate(id, payload, { new: true });
}
