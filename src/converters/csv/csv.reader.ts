import { Readable } from 'stream';
import { CastingContext, parse } from 'csv-parse';
import { CsvReaderOptions } from './csv-reader.options';
import { TimedFrameSplitter } from '../timed-frame-splitter';
import { CsvReaderStream } from './csv-reader.stream';
import { BaseReader } from '../../interfaces/base.reader';
import { DataChannel } from '../../interfaces/data-channel';
import { toDataChannel } from '../../utils/channels';

export class CsvReader implements BaseReader {

  protected castCsvValue: (value: string, context: CastingContext) => number | string | undefined;
  protected mapColumnToChannel: (column: string) => DataChannel | undefined;

  constructor(
    protected readonly options: CsvReaderOptions,
  ) {
    const map = options.columnToChannelMap;

    if (typeof map === 'function')
      this.mapColumnToChannel = (column) => toDataChannel(map(column));
    else if (typeof map === 'object')
      this.mapColumnToChannel = (column) => toDataChannel(map[column]);
    else
      this.mapColumnToChannel = (column) => toDataChannel(column);

    const cast = options.cast;

    if (typeof cast === 'function')
      this.castCsvValue = (value, context) => context.header ? value : cast(value, context.column.toString());
    else
      this.castCsvValue = (value, context) => context.header ? value : (isNaN(Number(value)) || value.length === 0 ? undefined : Number(value));
  }

  public get extensions(): string[] {
    return ['.csv', '.tsv'];
  }

  public async createStream(stream: Readable): Promise<CsvReaderStream> {
    const csvReaderStream = await this.createCsvStream(stream);

    const timeColumnOpt = this.options.timeColumn;
    const timeColumn = typeof timeColumnOpt === 'string' ? timeColumnOpt : timeColumnOpt(csvReaderStream.columns);

    const transform = new TimedFrameSplitter(timeColumn, this.mapColumnToChannel);

    return {
      ...csvReaderStream,
      stream: csvReaderStream.stream.pipe(transform),
    };
  }

  protected createCsvStream(stream: Readable): Promise<CsvReaderStream> {
    return new Promise((resolve, reject) => {
      const columns = this.options.columns;

      const resolveColumns = (columns: string[]) => {
        const channels = columns
          .map(this.mapColumnToChannel)
          .filter(column => !!column);

        resolve({
          stream: csv,
          columns: columns,
          channels: channels as DataChannel[],
        });

        csv.off('error', reject);
      };

      const csv = parse({
        bom: true,
        delimiter: this.options.delimiter || ',',
        record_delimiter: this.options.recordDelimiter,
        cast: this.castCsvValue,
        columns: columns ? columns : ((columns) => {
          resolveColumns(columns);

          return columns;
        }),
      });

      stream.pipe(csv);

      if (columns)
        return resolveColumns(columns);

      csv.once('error', reject);
    });
  }

}
