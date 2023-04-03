import { Transform, TransformCallback } from 'stream';
import { formatRacePakNumber } from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';

// noinspection JSAnnotator
export class RacePakFormatStream extends Transform {

  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk: Record<string, number | string>, encoding: BufferEncoding, callback: TransformCallback) {
    const result: Record<string, string> = {};

    Object.keys(chunk).forEach(key => {
      const value = chunk[key];

      if (typeof value !== 'number')
        result[key] = value;
      else if (key === TimedFrameGrouper.TIMESTAMP_CHANNEL)
        result[key] = formatRacePakNumber(value / 1000, 4);
      else
        result[key] = formatRacePakNumber(value);
    });

    callback(null, result);
  }

}
