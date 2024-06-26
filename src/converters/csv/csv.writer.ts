import { stringify, ColumnOption } from 'csv-stringify';
import { BaseWriter } from '../../interfaces/base.writer';
import { CsvWriterOptions } from './csv-writer.options';
import { getChannelName } from '../../utils/channels';
import { Readable, Transform } from 'stream';
import { TimedFrameGrouper } from '../timed-frame-grouper';

export class CsvWriter implements BaseWriter {

  constructor(protected readonly options: CsvWriterOptions) {}

  get extension(): string {
    return this.options.delimiter === '\t' ? '.tsv' : '.csv';
  }

  public createStream(stream: Readable): Transform {
    const interval = Math.abs(this.options.interval || 10);
    const transform = new TimedFrameGrouper(interval);

    return this.createCsvStream(stream.pipe(transform));
  }

  protected createCsvStream(stream: Readable): Transform {
    const cast = this.options.cast ?? this.castNumber.bind(this);

    const csv = stringify({
      delimiter: this.options.delimiter || ',',
      columns: this.createColumns(),
      header: true,
      quoted: this.options.quoted,
      quoted_empty: this.options.quotedEmpty,
      record_delimiter: this.options.recordDelimiter,
      cast: {
        number: (value, context) => cast(value, context.column?.toString() || ''),
      },
    });

    return stream.pipe(csv);
  }

  protected createColumns(): ColumnOption[] {
    return [
      {
        key: TimedFrameGrouper.TIMESTAMP_CHANNEL,
        header: this.options.timeColumn || 'Time (ms)',
      },
      ...this.options.channels.map<ColumnOption>(channel => ({
        key: channel.key,
        header: getChannelName(channel),
      })),
    ];
  }

  protected castNumber(value: number): string {
    return value.toLocaleString(this.options.castFractionPoint === 'comma' ? 'pt-BR' : 'en-US');
  }

}
