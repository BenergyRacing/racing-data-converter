import { Transform, TransformCallback } from 'stream';
import { formatWinDarabCsvItem, formatWinDarabNumber } from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';

// noinspection JSAnnotator
export class WinDarabFormatStream extends Transform {

  constructor() {
    super({ objectMode: true });
  }

  _transform(chunk: Record<string, number | string>, encoding: BufferEncoding, callback: TransformCallback) {
    const result: Record<string, string> = {};

    Object.keys(chunk).forEach(key => {
      let value = chunk[key];

      if (typeof value !== 'number')
        value = value.toString();
      else if (key === TimedFrameGrouper.TIMESTAMP_CHANNEL)
        value = formatWinDarabNumber(value / 1000, 2);
      else
        value = formatWinDarabNumber(value);

      result[key] = formatWinDarabCsvItem(value);
    });

    callback(null, result);
  }

}
