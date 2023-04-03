import { Readable, Transform } from 'stream';
import { ColumnOption } from 'csv-stringify';
import { CsvWriter } from '../csv/csv.writer';
import { StreamPrefixer } from '../stream-prefixer';
import { MotecCsvWriterOptions } from './motec-csv-writer.options';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { MotecCsvFormatStream } from './motec-csv-format-stream';
import {
  formatMotecChannelName,
  formatMotecDate,
  formatMotecNumber,
  formatMotecString,
  formatMotecTime
} from './utils';
import { getChannelName } from '../../utils/channels';

export class MotecCsvWriter extends CsvWriter {

  constructor(private readonly motecOptions: MotecCsvWriterOptions) {
    super({
      delimiter: ',',
      quoted: true,
      quotedEmpty: false,
      channels: motecOptions.channels,
      interval: motecOptions.interval || 10,
    });
  }

  get extension(): string {
    return '.csv';
  }

  protected createCsvStream(stream: Readable): Transform {
    const formatter = new MotecCsvFormatStream(this.options.channels);
    const prefixer = new StreamPrefixer(this.createHeader());

    return super.createCsvStream(stream.pipe(formatter)).pipe(prefixer);
  }

  protected createColumns(): ColumnOption[] {
    return [
      {
        key: TimedFrameGrouper.TIMESTAMP_CHANNEL,
        header: 'Time',
      },
      ...this.options.channels.map<ColumnOption>(channel => ({
        key: channel.key,
        header: formatMotecChannelName(channel),
      })),
    ];
  }

  protected createHeader(): string {
    const opt = this.motecOptions;
    const sampleRate = 1000 / (this.options.interval || 10);

    let header = '';

    header += `"Format","MoTeC CSV File",,,"Workbook","${formatMotecString(opt.workbook)}"\n`;
    header += `"Venue","${formatMotecString(opt.venue)}",,,"Worksheet","${formatMotecString(opt.worksheet)}"\n`;
    header += `"Vehicle","${formatMotecString(opt.vehicle)}",,,"${formatMotecString(opt.vehicleDescription)}",""\n`;
    header += `"Driver","${formatMotecString(opt.driver)}",,,"Engine ID","${formatMotecString(opt.engineId)}"\n`;
    header += `"Device","${formatMotecString(opt.device)}"\n`;
    header += `"Comment","${formatMotecString(opt.comment)}",,,"Session","${formatMotecString(opt.session)}"\n`;
    header += `"Log Date","${formatMotecDate(opt.logDate)}",,,"Origin Time","${formatMotecNumber(opt.originTime || 0, 3)}","s"\n`;
    header += `"Log Time","${formatMotecTime(opt.logDate)}",,,"Start Time","${formatMotecNumber(opt.originTime || 0, 3)}","s"\n`;
    header += `"Sample Rate","${formatMotecNumber(sampleRate, 3)}","Hz",,"End Time","${formatMotecNumber(opt.endTime, 3)}","s"\n`;
    header += `"Duration","${formatMotecNumber(opt.duration, 3)}","s",,"Start Distance","${formatMotecNumber(opt.startDistance)}","m"\n`;
    header += `"Range","${formatMotecString(opt.range)}",,,"End Distance","${formatMotecNumber(opt.endDistance)}","m"\n`;

    header += '\n';
    header += '\n';

    return header;
  }
}
