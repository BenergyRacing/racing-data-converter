import { Transform, TransformCallback } from 'stream';
import { DataChannelInterface } from '../../interfaces/data-channel.interface';
import { formatWinDarabNumber } from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';

// noinspection JSAnnotator
export class WinDarabFormatStream extends Transform {

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
        result[key] = formatWinDarabNumber(value / 1000, 2);
      else
        result[key] = formatWinDarabNumber(value);
    });

    callback(null, result);
  }

}
