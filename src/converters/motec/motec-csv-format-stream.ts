import { Transform, TransformCallback } from 'stream';
import { DataChannelInterface } from '../../interfaces/data-channel.interface';
import { formatMotecNumber } from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';

// noinspection JSAnnotator
export class MotecCsvFormatStream extends Transform {

  private hasAddedUnits: boolean = false;

  constructor(
    private readonly channels: DataChannelInterface[],
  ) {
    super({ objectMode: true });
  }

  _transform(chunk: Record<string, number | string>, encoding: BufferEncoding, callback: TransformCallback) {
    if (!this.hasAddedUnits) {
      this.push(this.createUnitsRow());
      this.hasAddedUnits = true;
    }

    callback(null, this.formatRow(chunk));
  }

  protected createUnitsRow(): Record<string, string> {
    return this.channels.reduce(
      (prev, channel) => {
        return { ...prev, [channel.key]: channel.unit };
      },
      { [TimedFrameGrouper.TIMESTAMP_CHANNEL]: 's' },
    );
  }

  protected formatRow(chunk: Record<string, number | string>): Record<string, string> {
    const result: Record<string, string> = {};

    Object.keys(chunk).forEach(key => {
      const value = chunk[key];

      if (typeof value !== 'number')
        result[key] = value;
      else if (key === TimedFrameGrouper.TIMESTAMP_CHANNEL)
        result[key] = formatMotecNumber(value / 1000, 3);
      else
        result[key] = formatMotecNumber(value);
    });

    return result;
  }
}
