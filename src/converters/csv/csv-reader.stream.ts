import { Transform } from 'stream';
import { BaseReaderStream } from '../../interfaces/base.reader';

export interface CsvReaderStream extends BaseReaderStream {
  /**
   * The CSV stream
   */
  stream: Transform;

  /**
   * The CSV original columns
   */
  columns: string[];

  /**
   * The CSV channels, mapped from columns
   */
  channels: string[];
}
