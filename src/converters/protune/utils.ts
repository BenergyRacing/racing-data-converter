import { DataChannel } from '../../interfaces/data-channel';


export function formatProtuneString(value: string | undefined): string {
  if (!value)
    return '';

  return value.replace(/;|\n/g, '');
}

export function formatProtuneNumber(value: number | undefined, decimalPlaces: number): string {
  if (value === undefined || isNaN(value))
    return '';

  return value.toLocaleString('pt-BR', {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces,
  });
}

export function formatProtuneChannelName(channel: DataChannel): string {
  return formatProtuneString(channel.name || channel.key); // TODO
}

export function formatProtuneUnit(channel: DataChannel): string {
  return formatProtuneString(channel.unit || ''); // TODO
}
