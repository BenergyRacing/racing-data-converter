import { Transform } from 'stream';
import { DataFrame } from '../interfaces/data-frame';

// noinspection JSAnnotator
/**
 * Uma stream de transform que agrupa data frames em intervalos de tempo.
 *
 * Tópicos não são duplicados caso existam vários data frames no mesmo segundo,
 * apenas a última informação daquele tópico é mantida.
 *
 * Por exemplo, a cada 1 segundo, agrupa todos os data frames emitidos dentro desse segundo em um objeto
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
