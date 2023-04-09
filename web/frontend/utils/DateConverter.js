export const DateConverter = (raw_date) => {
  const date = new Date(raw_date);

  return date.toDateString();
};
