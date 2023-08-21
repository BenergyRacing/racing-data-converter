import { CsvReader } from '../converters/csv/csv.reader';
import { parseDataChannelFromName } from '../utils/channels';

export enum InputFormat {
  CSV = 'csv',
}

export function createInput(format: InputFormat, options: any): CsvReader {
  if (format === InputFormat.CSV)
    return new CsvReader({
      timeColumn: (columns) => columns[0],
      columnToChannelMap: (column) => parseDataChannelFromName(column).key,
      ...options,
    });

  throw new Error('Unknown input format');
}
