const getMonthRange = (monthInput) => {
  const now = new Date();
  const month = monthInput || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const [yearStr, monthStr] = month.split('-');
  const year = Number(yearStr);
  const monthNumber = Number(monthStr);

  const start = new Date(year, monthNumber - 1, 1);
  const end = new Date(year, monthNumber, 1);

  return { month, start, end };
};

const startOfDay = (dateLike) => {
  const date = new Date(dateLike);
  date.setHours(0, 0, 0, 0);
  return date;
};

module.exports = {
  getMonthRange,
  startOfDay,
};
