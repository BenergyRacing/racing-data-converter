import { Readable, Transform } from 'stream';
import { ColumnOption } from 'csv-stringify';
import { CsvWriter } from '../csv/csv.writer';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { RacePakWriterOptions } from './race-pak-writer.options';
import { RacePakFormatStream } from './race-pak-format-stream';
import { formatRacePakChannelName } from './utils';

export class RacePakWriter extends CsvWriter {

  constructor(options: RacePakWriterOptions) {
    super({
      delimiter: ',',
      interval: options.interval,
      channels: options.channels,
    });
  }

  get extension(): string {
    return '.txt';
  }

  protected createCsvStream(stream: Readable): Transform {
    const formatter = new RacePakFormatStream();

    return super.createCsvStream(stream.pipe(formatter));
  }

  protected createColumns(): ColumnOption[] {
    return [
      {
        key: TimedFrameGrouper.TIMESTAMP_CHANNEL,
        header: 'Time',
      },
      ...this.options.channels.map<ColumnOption>(channel => ({
        key: channel.key,
        header: formatRacePakChannelName(channel),
      })),
    ];
  }

}
