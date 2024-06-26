import { DataChannel } from '../interfaces/data-channel';

export function getChannelName(channel: DataChannel): string {
  const name = channel.name || channel.key;
  const unit = channel.unit;

  if (unit)
    return `${name} (${unit})`;

  return name;
}

/**
 * Parses a column name. Matches the format "Name (unit) [key]"
 * The unit and the key are optional.
 *
 * Examples:
 * - Speed
 * - Speed (Km/h)
 * - Speed (Km/h) [speed]
 *
 * @param name The column name
 */
export function parseDataChannelFromName(name: string): DataChannel {
  const regex = /^(.*?)\W*(?:\((.+?)\))?\W*(?:\[(.+?)\])?$/m;
  const match = regex.exec(name);

  if (!match) {
    return {
      key: name,
      name: name,
    };
  }

  return {
    key: match[3] || name,
    name: match[1] || name,
    unit: match[2],
  };
}

/**
 * Converts a data channel to the data channel object.
 *
 * @param key The key, being a data channel object, a string or undefined
 */
export function toDataChannel(key: DataChannel | string | undefined): DataChannel | undefined {
  if (typeof key === 'object')
    return key;

  if (typeof key === 'string')
    return { key };

  return undefined;
}
