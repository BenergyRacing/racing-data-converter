import { parseDataChannelFromName } from '../utils/channels';
import { BaseReader } from '../interfaces/base.reader';
import { CsvReader } from '../converters/csv';
import { MeteorReader } from '../converters/meteor';

export enum InputFormat {
  CSV = 'csv',
  BENERGY_METEOR = 'benergy-meteor',
}

export function createInput(format: InputFormat, options: any): BaseReader {
  if (format === InputFormat.CSV)
    return new CsvReader({
      timeColumn: (columns) => columns[0],
      columnToChannelMap: (column) => parseDataChannelFromName(column),
      ...options,
    });

  if (format === InputFormat.BENERGY_METEOR)
    return new MeteorReader(options);

  throw new Error('Unknown input format');
}
