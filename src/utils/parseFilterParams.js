const parseBoolean = (value) => {
  if (typeof value !== 'string') return;

  if (!['true', 'false'].includes(value)) return;

  return value === 'true';
};
const typeList = ['work', 'home', 'personal'];

export function parseFilterParams({ contactType, isFavourite }) {
  const parsedType = typeList.includes(contactType) ? contactType : null;
  const parsedFavorite = parseBoolean(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedFavorite,
  };
}
