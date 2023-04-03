import { DataChannelInterface } from '../../interfaces/data-channel.interface';

export function formatWinDarabString(value: string | undefined): string {
  if (!value)
    return '';

  return value.replace(/\t|\n/g, '');
}

export function formatWinDarabNumber(value: number | undefined, maxDecimalPlaces: number = 0): string {
  if (value === undefined || isNaN(value))
    return '';

  return value.toLocaleString('en-US', {
    maximumFractionDigits: Math.max(maxDecimalPlaces, 2),
    minimumFractionDigits: maxDecimalPlaces,
  });
}

export function formatWinDarabChannelName(channel: DataChannelInterface): string {
  const name = channel.name || channel.key; // TODO

  if (channel.unit)
    return `${name} [${channel.unit}]`;

  return name;
}

