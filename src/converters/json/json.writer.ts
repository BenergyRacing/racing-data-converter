import { BaseWriter } from '../../interfaces/base.writer';
import { Readable, Transform, TransformCallback } from 'stream';
import { JsonWriterOptions } from './json-writer.options';
import { DataFrame } from '../../interfaces/data-frame';
import { JsonFormat } from './json-format';

export class JsonWriter implements BaseWriter {

  constructor(
    private readonly options: JsonWriterOptions
  ) {}

  get extension(): string {
    return '.json';
  }

  public createStream(stream: Readable): Transform {
    const frames: DataFrame[] = [];

    return stream.pipe(
      new Transform({
        writableObjectMode: true,
        readableObjectMode: false,

        transform: (chunk: DataFrame, encoding: BufferEncoding, callback: TransformCallback) => {
          frames.push(chunk);
          callback(null);
        },

        flush: (callback: TransformCallback) => {
          const format: JsonFormat = {
            channels: this.options.channels,
            frames: frames,
          };

          callback(null, JSON.stringify(format, null, this.options.indent));
        }
      })
    );
  }

}
