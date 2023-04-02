import { stringify, ColumnOption } from 'csv-stringify';
import { DataWriterInterface } from '../../interfaces/data-writer.interface';
import { CsvWriterOptions } from './csv-writer.options';
import { getChannelName } from '../../utils/channels';
import { Readable, Transform } from 'stream';
import { TimedFrameGrouper } from '../timed-frame-grouper';

export class CsvWriter implements DataWriterInterface {

  constructor(protected readonly options: CsvWriterOptions) {}

  get extension(): string {
    return this.options.delimiter === '\t' ? '.tsv' : '.csv';
  }

  public createStream(stream: Readable): Transform {
    const interval = Math.abs(this.options.interval || 20);
    const delimiter = this.options.delimiter || ',';

    const transform = new TimedFrameGrouper(interval);

    const csv = stringify({
      delimiter: delimiter,
      columns: [
        {
          key: TimedFrameGrouper.TIMESTAMP_CHANNEL,
          header: 'Time (ms)',
        },
        ...this.options.channels.map<ColumnOption>(channel => ({
          key: channel.key,
          header: getChannelName(channel),
        })),
      ],
      header: true,
    });

    return stream.pipe(transform).pipe(csv);
  }

}
