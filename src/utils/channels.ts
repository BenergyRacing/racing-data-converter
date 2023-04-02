import { DataChannelInterface } from '../interfaces/data-channel.interface';

export function getChannelName(channel: DataChannelInterface): string {
  const name = channel.name || channel.key;
  const unit = channel.unit;

  if (unit)
    return `${name} (${unit})`;

  return name;
}
