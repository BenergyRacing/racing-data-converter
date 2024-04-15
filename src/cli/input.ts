import { parseDataChannelFromName } from '../utils/channels';
import { BaseReader } from '../interfaces/base.reader';
import { CsvReader, CsvReaderOptions } from '../converters/csv';
import { MeteorReader } from '../converters/meteor';
import { JsonReader } from '../converters/json';

export enum InputFormat {
  AUTO = 'auto',
  CSV = 'csv',
  BENERGY_METEOR = 'benergy-meteor',
  JSON = 'json',
}

export function getFormatFromExtension(filename: string): [InputFormat, any] {
  filename = filename.toLowerCase();

  if (filename.endsWith('.csv'))
    return [InputFormat.CSV, {}];

  if (filename.endsWith('.tsv'))
    return [InputFormat.CSV, { delimiter: '\t' } as CsvReaderOptions];

  if (filename.endsWith('.json'))
    return [InputFormat.JSON, {}];

  if (filename.endsWith('.met') || filename.endsWith('.b24') || filename.endsWith('.b23') || filename.endsWith('.b20'))
    return [InputFormat.BENERGY_METEOR, {}];

  throw new Error('Could not find an input format based on the file extension.');
}

export function createInput(format: InputFormat, filename: string, options: any): BaseReader {
  if (format === InputFormat.AUTO) {
    const [extensionFormat, defaultOptions] = getFormatFromExtension(filename);

    format = extensionFormat;
    options = { ...defaultOptions, ...options };
  }

  if (format === InputFormat.CSV)
    return new CsvReader({
      timeColumn: (columns) => columns[0],
      columnToChannelMap: (column) => parseDataChannelFromName(column),
      ...options,
    });

  if (format === InputFormat.BENERGY_METEOR)
    return new MeteorReader(options);

  if (format === InputFormat.JSON)
    return new JsonReader();

  throw new Error('Unknown input format');
}
