import { Transform } from 'stream';
import { BaseReaderStream } from '../../interfaces/base.reader';
import { DataChannel } from '../../interfaces/data-channel';

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
  channels: DataChannel[];
}
