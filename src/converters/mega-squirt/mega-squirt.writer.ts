import { CsvWriter } from '../csv/csv.writer';
import { MegaSquirtWriterOptions } from './mega-squirt-writer.options';

export class MegaSquirtWriter extends CsvWriter {

  constructor(options: MegaSquirtWriterOptions) {
    super({
      delimiter: '\t',
      ...options,
    });
  }

  get extension(): string {
    return '.msl';
  }

}
