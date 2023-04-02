import { Readable, Transform } from 'stream';
import { CsvWriter } from '../csv/csv.writer';
import { ExcelCsvWriterOptions } from './excel-csv-writer.options';
import { StreamPrefixer } from '../stream-prefixer';

export class ExcelCsvWriter extends CsvWriter {

  constructor(options: ExcelCsvWriterOptions) {
    super({
      delimiter: '\t',
      ...options,
    });
  }

  get extension(): string {
    return '.csv';
  }

  public createStream(stream: Readable): Transform {
    const result = super.createStream(stream);

    const prefixer = new StreamPrefixer('sep=' + this.options.delimiter + '\n');

    return result.pipe(prefixer);
  }
}
