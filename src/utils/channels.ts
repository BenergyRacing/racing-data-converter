import { DataChannel } from '../interfaces/data-channel';

export function getChannelName(channel: DataChannel): string {
  const name = channel.name || channel.key;
  const unit = channel.unit;

  if (unit)
    return `${name} (${unit})`;

  return name;
}
