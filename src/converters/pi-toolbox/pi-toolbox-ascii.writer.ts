import { Readable, Transform } from 'stream';
import { ColumnOption } from 'csv-stringify';
import { PiToolboxAsciiWriterOptions } from './pi-toolbox-ascii-writer.options';
import { CsvWriter } from '../csv/csv.writer';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { StreamPrefixer } from '../stream-prefixer';
import {
  formatPiToolboxBoolean,
  formatPiToolboxColumnName,
  formatPiToolboxNumber,
  formatPiToolboxString,
} from './utils';

export class PiToolboxAsciiWriter extends CsvWriter {

  constructor(private readonly piToolboxOptions: PiToolboxAsciiWriterOptions) {
    super({
      channels: piToolboxOptions.channels,
      interval: piToolboxOptions.interval,
      delimiter: '\t',
    })
  }

  get extension(): string {
    return '.txt';
  }

  public createStream(stream: Readable): Transform {
    const result = super.createStream(stream);

    const prefixer = new StreamPrefixer(this.createHeader());

    return result.pipe(prefixer);
  }

  protected createColumns(): ColumnOption[] {
    return [
      {
        key: TimedFrameGrouper.TIMESTAMP_CHANNEL,
        header: 'Time',
      },
      ...this.piToolboxOptions.channels.map<ColumnOption>(channel => ({
        key: channel.key,
        header: formatPiToolboxColumnName(channel),
      })),
    ];
  }

  protected createHeader(): string {
    let header = '';

    header += 'PiToolboxVersionedASCIIDataSet\n';
    header += 'Version\t2\n\n';

    header += '{OutingInformation}\n';
    header += 'CarName\t' + formatPiToolboxString(this.piToolboxOptions.carName) + '\n';
    header += 'DriverName\t' + formatPiToolboxString(this.piToolboxOptions.driverName) + '\n';
    header += 'EngineTest\t' + formatPiToolboxBoolean(this.piToolboxOptions.engineTest) + '\n';
    header += 'FirstLapNumber\t' + formatPiToolboxNumber(this.piToolboxOptions.firstLapNumber) + '\n';
    header += 'LongComment\t' + formatPiToolboxString(this.piToolboxOptions.longComment) + '\n';
    header += 'OutingNumber\t' + formatPiToolboxNumber(this.piToolboxOptions.outingNumber) + '\n';
    header += 'SessionNumber\t' + formatPiToolboxNumber(this.piToolboxOptions.sessionNumber) + '\n';
    header += 'ShortComment\t' + formatPiToolboxString(this.piToolboxOptions.shortComment) + '\n';
    header += 'TrackName\t' + formatPiToolboxString(this.piToolboxOptions.trackName) + '\n';
    header += '\n';

    header += '{ChannelBlock}\n';

    return header;
  }

}
