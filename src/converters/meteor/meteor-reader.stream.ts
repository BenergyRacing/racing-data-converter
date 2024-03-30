import { Transform } from 'stream';
import { BaseReaderStream } from '../../interfaces/base.reader';

export interface MeteorReaderStream extends BaseReaderStream {
  /**
   * The dataframe stream
   */
  stream: Transform;

  /**
   * The format version number
   */
  version: number;

  /**
   * The log name
   */
  name: string;

  /**
   * The log date and time
   */
  date?: Date;
}
