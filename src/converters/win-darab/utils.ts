import { DataChannel } from '../../interfaces/data-channel';

const winDarabCsvItemLength = 15;

export function formatWinDarabString(value: string | undefined): string {
  if (!value)
    return '';

  return value.replace(/\t|\n/g, '');
}

export function formatWinDarabNumber(value: number | undefined, minDecimalPlaces: number = 0): string {
  if (value === undefined || isNaN(value))
    return '';

  return value.toLocaleString('en-US', {
    maximumFractionDigits: Math.max(minDecimalPlaces, 2),
    minimumFractionDigits: minDecimalPlaces,
  });
}

export function formatWinDarabChannelName(channel: DataChannel): string {
  const name = channel.name || channel.key; // TODO

  return formatWinDarabColumnName(name, channel.unit);
}

export function formatWinDarabColumnName(name: string, unit: string | undefined): string {
  unit = unit ? `[${unit}]` : '';

  return name + ' '.repeat(Math.max(winDarabCsvItemLength - name.length - unit.length, 1)) + unit;
}

export function formatWinDarabCsvItem(value: string): string {
  return value.padStart(winDarabCsvItemLength, ' ');
}
