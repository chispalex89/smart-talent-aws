export const yearsBeforeToday = (years: number) => {
  const date = new Date();
  date.setFullYear(date.getFullYear() - years);
  return date;
}