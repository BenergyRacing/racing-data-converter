import { DataChannelInterface } from '../../interfaces/data-channel.interface';

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

export function formatWinDarabChannelName(channel: DataChannelInterface): string {
  const name = channel.name || channel.key; // TODO

  if (channel.unit)
    return `${name} [${channel.unit}]`;

  return name;
}

