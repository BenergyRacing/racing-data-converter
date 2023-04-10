import { PassThrough, TransformOptions } from 'stream';
import { DataFrame } from '../interfaces/data-frame';

/**
 * A simple passthrough stream implementation that allows writing data frames
 */
// noinspection JSAnnotator
export class DataFrameStream extends PassThrough {

  constructor(opt: TransformOptions = {}) {
    super({ ...opt, objectMode: true });
  }

  /**
   * Writes a data frame into the stream
   *
   * @param chunk The data frame
   */
  //@ts-ignore
  public write(chunk: DataFrame): void;

  /**
   * Writes a data frame into the stream
   *
   * @param chunk The data frame
   * @param cb Callback for when this chunk of data is flushed
   */
  //@ts-ignore
  public write(chunk: DataFrame, cb?: (error: Error | null | undefined) => void): void;

  /**
   * Writes all data frames into the stream
   *
   * @param frames The data frame list
   */
  //@ts-ignore
  public writeAll(frames: DataFrame[]): void {
    for (const frame of frames) {
      this.write(frame);
    }
  }

}
