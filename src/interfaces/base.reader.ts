import { Readable, Transform } from 'stream';
import { DataChannel } from './data-channel';

export interface BaseReader {

  /**
   * Gets the valid file extensions, including the dot
   */
  readonly extensions: string[];

  /**
   * Creates a transform stream pipeline that converts the
   * raw file format into {@link DataFrame} objects
   *
   * @param stream The stream object
   */
  createStream(stream: Readable): Promise<BaseReaderStream>;

}

export interface BaseReaderStream {
  /**
   * The dataframe stream
   */
  stream: Readable;

  /**
   * The list of channels
   */
  channels: DataChannel[];
}
