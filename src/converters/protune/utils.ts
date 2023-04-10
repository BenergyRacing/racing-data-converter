import { DataChannel } from '../../interfaces/data-channel';
import { proTuneChannels } from './mappings';
import { SensorChannel } from '../../enums/sensor-channel';


export function formatProtuneString(value: string | undefined): string {
  if (!value)
    return '';

  return value.replace(/;|\n/g, '');
}

export function formatProtuneMultilineString(value: string | undefined): string {
  if (!value)
    return '';

  return value.trim() + '\n';
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
  const name = proTuneChannels[channel.key as SensorChannel] || channel.name || channel.key;

  return formatProtuneString(name);
}

export function formatProtuneUnit(channel: DataChannel): string {
  return formatProtuneString(channel.unit || '');
}
