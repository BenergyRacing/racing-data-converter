import { Transform, TransformCallback } from 'stream';
import { DataChannel } from '../../interfaces/data-channel';
import { formatProtuneNumber } from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';

// noinspection JSAnnotator
export class ProtuneGroupStream extends Transform {

  constructor(
    private readonly channels: DataChannel[],
  ) {
    super({ writableObjectMode: true, readableObjectMode: false });
  }

  _transform(chunk: Record<string, number>, encoding: BufferEncoding, callback: TransformCallback) {
    const channelValues = [
      formatProtuneNumber(chunk[TimedFrameGrouper.TIMESTAMP_CHANNEL] / 1000, 3),
      ...this.channels.map(topic => formatProtuneNumber(chunk[topic.key], topic.decimalPlaces ?? 2)),
    ];

    const row = channelValues.join('A') + '\n';

    callback(null, row);
  }
}
