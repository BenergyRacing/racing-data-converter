import { CsvWriter } from '../csv/csv.writer';
import { MslWriterOptions } from './msl-writer.options';

export class MslWriter extends CsvWriter {

  constructor(options: MslWriterOptions) {
    super({
      delimiter: '\t',
      ...options,
    });
  }

  get extension(): string {
    return '.msl';
  }

}
