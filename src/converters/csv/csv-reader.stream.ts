import { Transform } from 'stream';

export interface CsvReaderStream {
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
