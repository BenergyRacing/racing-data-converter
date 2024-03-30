import { Readable, Transform } from 'stream';

export interface BaseWriter {

  /**
   * Gets the suggested file extension, including the dot
   */
  readonly extension: string;

  /**
   * Creates a transform stream pipeline that converts the
   * {@link DataFrame} objects into the file format
   *
   * @param stream The readable stream
   */
  createStream(stream: Readable): Transform;

}
