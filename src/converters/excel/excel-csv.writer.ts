import { Readable, Transform } from 'stream';
import { CsvWriter } from '../csv/csv.writer';
import { ExcelCsvWriterOptions } from './excel-csv-writer.options';
import { StreamPrefixer } from '../stream-prefixer';

export class ExcelCsvWriter extends CsvWriter {

  constructor(options: ExcelCsvWriterOptions) {
    super({
      delimiter: options.delimiter || '\t',
      recordDelimiter: options.recordDelimiter || '\r\n',
      ...options,
    });
  }

  get extension(): string {
    return '.csv';
  }

  public createStream(stream: Readable): Transform {
    const result = super.createStream(stream);

    const prefixer = new StreamPrefixer('sep=' + this.options.delimiter + this.options.recordDelimiter);

    return result.pipe(prefixer);
  }
}
