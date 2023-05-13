import { Transform } from 'stream';
import { DataFrame } from '../interfaces/data-frame';

// noinspection JSAnnotator
/**
 * A transform stream that fixes times by offsetting the first entry to zero.
 */
export class TimeFixer extends Transform {

  constructor() {
    super({ objectMode: true });
  }

  private hasStarted: boolean = false;

  private timeOffset: number = 0;

  _transform(chunk: DataFrame, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    if (!this.hasStarted) {
      this.timeOffset = chunk.timestamp;
      this.hasStarted = true;
    }

    const newChunk: DataFrame = {
      ...chunk,
      timestamp: chunk.timestamp - this.timeOffset,
    };

    callback(null, newChunk);
  }

}
