import { Readable, Transform } from 'stream';
import { CsvWriter } from '../csv/csv.writer';
import { StreamPrefixer } from '../stream-prefixer';
import { WinDarabWriterOptions } from './win-darab-writer.options';
import { WinDarabFormatStream } from './win-darab-format-stream';
import {
  formatWinDarabChannelName,
  formatWinDarabColumnName,
  formatWinDarabNumber,
  formatWinDarabString
} from './utils';
import { ColumnOption } from 'csv-stringify';
import { TimedFrameGrouper } from '../timed-frame-grouper';

export class WinDarabWriter extends CsvWriter {

  constructor(private readonly windarabOptions: WinDarabWriterOptions) {
    super({
      delimiter: '\t',
      channels: windarabOptions.channels,
      interval: windarabOptions.interval,
      quoted: false,
      quotedEmpty: false,
    });
  }

  get extension(): string {
    return '.txt';
  }

  protected createCsvStream(stream: Readable): Transform {
    const formatter = new WinDarabFormatStream(this.options.channels);
    const prefixer = new StreamPrefixer(this.createHeader());

    return super.createCsvStream(stream.pipe(formatter)).pipe(prefixer);
  }

  protected createColumns(): ColumnOption[] {
    return [
      {
        key: TimedFrameGrouper.TIMESTAMP_CHANNEL,
        header: formatWinDarabColumnName('xtime', 's'),
      },
      ...this.options.channels.map<ColumnOption>(channel => ({
        key: channel.key,
        header: formatWinDarabChannelName(channel),
      })),
    ];
  }

  protected createHeader(): string {
    const opt = this.windarabOptions;
    let header = '';

    const date = opt.createDate ?? new Date();

    const formattedDate = (date.getMonth() + 1).toString().padStart(2, '0') + '.' +
      date.getDate().toString().padStart(2, '0') + '.' +
      date.getFullYear().toString().padStart(4, '0') + ' ' +
      date.getHours().toString().padStart(2, '0') + ':' +
      date.getMinutes().toString().padStart(2, '0') + ':' +
      date.getSeconds().toString().padStart(2, '0');

    header += `# BOSCH-DARAB extract file created ${formattedDate}\n`;
    header += '#\n';

    if (opt.sourceFilePath)
      header += `# Data from source file "${formatWinDarabString(opt.sourceFilePath)}"\n`;

    if (opt.startTime !== undefined && opt.endTime !== undefined) {
      const startTime = formatWinDarabNumber(opt.startTime / 1000, 2);
      const endTime = formatWinDarabNumber(opt.endTime / 1000, 2);

      header += `# where ${startTime} <= xtime <= ${endTime}\n`;
    }

    header += '#\n';

    return header;
  }
}
