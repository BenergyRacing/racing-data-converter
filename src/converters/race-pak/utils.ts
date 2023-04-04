import { DataChannel } from '../../interfaces/data-channel';

export function formatRacePakNumber(value: number | undefined, minDecimalPlaces: number = 2): string {
  if (value === undefined || isNaN(value))
    return '-###';

  return value.toLocaleString('en-US', {
    maximumFractionDigits: Math.max(minDecimalPlaces, 4),
    minimumFractionDigits: minDecimalPlaces,
  });
}

export function formatRacePakChannelName(channel: DataChannel): string {
  return channel.name || channel.key; // TODO
}
