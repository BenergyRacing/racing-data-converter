import { Transform } from 'stream';
import { DataFrame } from '../interfaces/data-frame';
import { SensorChannel } from '../enums/sensor-channel';
import { DataChannel } from '../interfaces/data-channel';

// noinspection JSAnnotator
/**
 * A transform stream that splits objects into individual data frames.
 */
export class TimedFrameSplitter extends Transform {

  constructor(
    private readonly timestampKey: string,
    private readonly mapKeyToChannel: (key: string) => DataChannel | undefined,
  ) {
    super({ objectMode: true });
  }

  _transform(chunk: Record<string, number | unknown>, encoding: BufferEncoding, callback: (error?: Error | null, data?: any) => void) {
    const timestamp = chunk[this.timestampKey];

    if (typeof timestamp !== 'number') {
      callback(new Error('Missing timestamp from chunk'));
      return;
    }

    for (const key of Object.keys(chunk)) {
      const value = chunk[key];

      if (typeof value !== 'number')
        continue;

      const channel = this.mapKeyToChannel(key)?.key;

      if (!channel)
        continue;

      const frame: DataFrame = { timestamp, value, channel };

      this.push(frame);
    }

    callback();
  }

}
