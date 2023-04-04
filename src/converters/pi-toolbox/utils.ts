import { DataChannel } from '../../interfaces/data-channel';

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

export function formatPiToolboxColumnName(channel: DataChannel): string {
  const name = channel.name || channel.key;

  if (channel.unit)
    return formatPiToolboxString(`${name}[${channel.unit}]`);

  return formatPiToolboxString(name);
}
