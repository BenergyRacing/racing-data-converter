import { DataChannelInterface } from '../../interfaces/data-channel.interface';

export function formatPiToolboxString(value: string | undefined): string {
  if (!value)
    return '';

  return value.replace(/\t|\n/g, ' ');
}

export function formatPiToolboxBoolean(value: boolean | undefined): string {
  return value ? 'True' : 'False';
}

export function formatPiToolboxNumber(value: number | undefined): string {
  if (value === undefined || isNaN(value))
    return '0';

  return Number(value).toString();
}

export function formatPiToolboxColumnName(channel: DataChannelInterface): string {
  const name = channel.name || channel.key;

  if (channel.unit)
    return formatPiToolboxString(`${name}[${channel.unit}]`);

  return formatPiToolboxString(name);
}
