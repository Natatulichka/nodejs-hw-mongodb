import { SORT_ORDER } from '../constants/index.js';

function parseSortBy(value) {
  if (typeof value !== 'string') {
    return '_id';
  }
  const keys = [
    '_id',
    'name',
    'phoneNumber',
    'email',
    'isFavourite',
    'contactType',
  ];
  if (keys.includes(value) !== true) {
    return '_id';
  }
  return value;
}
function parseSortOrder(value) {
  if (typeof value !== 'string') {
    return SORT_ORDER.ASC;
  }

  if ([SORT_ORDER.ASC, SORT_ORDER.DESC].includes(value)) {
    return value;
  }

  return SORT_ORDER.ASC;
}
export function parseSortParams(query) {
  const { sortBy, sortOrder } = query;

  const parsedSortBy = parseSortBy(sortBy);
  const parsedSortOrder = parseSortOrder(sortOrder);

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
}
