import { Transform } from 'stream';
import { DataFrame } from '../interfaces/data-frame';

// noinspection JSAnnotator
/**
 * A transform stream that groups data frames by time intervals.
 *
 * Topics are not duplicated in case there are multiple data frames in the same interval,
 * only the last information is accounted.
 *
 * For instance, it will group all data frames emitted within one second in a single object.
 */
export class TimedFrameGrouper extends Transform {

  public static readonly TIMESTAMP_CHANNEL = 'bnrgy_timestamp';

  private currentTime: number = 0;
  private currentData: Record<string, number> = { [TimedFrameGrouper.TIMESTAMP_CHANNEL]: 0 };
  private currentDataFrames: number = 0;

  constructor(
    private readonly interval: number,
  ) {
    super({ objectMode: true });
  }

  _transform(chunk: DataFrame, encoding: BufferEncoding, callback: () => void) {
    while (true) {
      if (chunk.timestamp <= this.currentTime) {

        this.currentData[chunk.channel] = chunk.value;
        this.currentDataFrames++;
        return callback();

      } else {

        if (this.currentDataFrames > 0) {
          this.push({...this.currentData});
        }

        this.currentTime += this.interval;
        this.currentData[TimedFrameGrouper.TIMESTAMP_CHANNEL] = this.currentTime;
        this.currentDataFrames = 0;
      }
    }
  }

  _flush(callback: () => void) {
    if (this.currentDataFrames > 0) {
      this.push({...this.currentData});
      this.currentDataFrames = 0;
    }
    callback();
  }

}
