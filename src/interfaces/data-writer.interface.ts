import { Readable, Transform } from 'stream';

export interface DataWriterInterface<C = string> {

  /**
   * Gets the suggested file extension, including the dot
   */
  readonly get extension: string;

  /**
   * Creates a transform stream pipeline that converts the
   * {@link DataFrameInterface} objects into the file format
   *
   * @param stream The readable stream
   */
  createStream(stream: Readable): Transform;

}
