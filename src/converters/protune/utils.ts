import { SensorChannelType } from '../../enums/sensor-channel.type';
import { DataChannelInterface } from '../../interfaces/data-channel.interface';


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

export function formatProtuneChannelName(channel: DataChannelInterface): string {
  return formatProtuneString(channel.name || channel.key); // TODO
}

export function formatProtuneUnit(channel: DataChannelInterface): string {
  return formatProtuneString(channel.unit || ''); // TODO
}
