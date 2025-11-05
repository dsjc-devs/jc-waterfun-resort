// Shared date formatting utility used across server (emails/SMS)
// Matches the formatting in reservation-details template.

export const formatDateInTimeZone = (
  inputDate,
  { timeZone = 'Asia/Manila', includeTime = true } = {}
) => {
  if (!inputDate) return 'Invalid date';

  const date = new Date(inputDate);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: includeTime ? 'numeric' : undefined,
    minute: includeTime ? '2-digit' : undefined,
    hour12: true
  });

  const parts = formatter.formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value || '';

  let month = get('month');
  if (month && !month.endsWith('.')) month = `${month}.`;
  const day = get('day');
  const year = get('year');

  if (!includeTime) return `${month} ${day}, ${year}`;

  const hour = get('hour');
  const minute = get('minute');
  const period = get('dayPeriod');
  return `${month} ${day}, ${year} ${hour}:${minute} ${period}`;
};

export default formatDateInTimeZone;
