
export function formatMotecString(value: string | undefined): string {
  if (!value)
    return '';

  return value.replace(/"|\n/g, '');
}

export function formatMotecNumber(value: number | undefined, minDecimalPlaces: number = 0): string {
  if (value === undefined || isNaN(value))
    return '';

  return value.toLocaleString('en-US', {
    maximumFractionDigits: Math.max(3, minDecimalPlaces),
    minimumFractionDigits: minDecimalPlaces,
  });
}

export function formatMotecDate(date: Date | undefined): string {
  if (!date)
    date = new Date();

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function formatMotecTime(date: Date | undefined): string {
  if (!date)
    date = new Date();

  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });
}
