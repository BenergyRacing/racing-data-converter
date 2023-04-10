import { Transform, TransformCallback } from 'stream';
import { formatWinDarabCsvItem, formatWinDarabNumber } from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { DataChannel } from '../../interfaces/data-channel';

// noinspection JSAnnotator
export class WinDarabFormatStream extends Transform {

  private readonly baseChunk: Record<string, string>;

  constructor(channels: DataChannel[]) {
    super({ objectMode: true });

    this.baseChunk = channels.reduce<Record<string, string>>(
      (prev, channel) => {
        prev[channel.key] = formatWinDarabCsvItem('');
        return prev;
      },
      {},
    );
  }

  _transform(chunk: Record<string, number | string>, encoding: BufferEncoding, callback: TransformCallback) {
    const result: Record<string, string> = { ...this.baseChunk };

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
