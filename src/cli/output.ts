import { BaseWriter } from '../interfaces/base.writer';
import { CsvWriter, ExcelCsvWriter, MegaSquirtWriter, MotecCsvWriter } from '../index';
import { DataChannel } from '../interfaces/data-channel';
import { PiToolboxAsciiWriter } from '../converters/pi-toolbox';
import { ProtuneWriter } from '../converters/protune';
import { RacePakWriter } from '../converters/race-pak';
import { WinDarabWriter } from '../converters/win-darab';

export enum OutputFormat {
  CSV = 'csv',
  EXCEL_CSV = 'excel-csv',
  MEGA_SQUIRT = 'mega-squirt',
  MOTEC_CSV = 'motec-csv',
  PI_TOOLBOX_ASCII = 'pi-toolbox-ascii',
  PROTUNE = 'protune',
  RACE_PAK = 'race-pak',
  WIN_DARAB = 'win-darab',
}

export function createOutput(format: OutputFormat, channels: DataChannel[], options: any): BaseWriter {
  options = {
    ...options,
    channels,
  };

  if (format === OutputFormat.CSV)
    return new CsvWriter(options);

  if (format === OutputFormat.EXCEL_CSV)
    return new ExcelCsvWriter(options);

  if (format === OutputFormat.MEGA_SQUIRT)
    return new MegaSquirtWriter(options);

  if (format === OutputFormat.MOTEC_CSV)
    return new MotecCsvWriter(options);

  if (format === OutputFormat.PI_TOOLBOX_ASCII)
    return new PiToolboxAsciiWriter(options);

  if (format === OutputFormat.PROTUNE)
    return new ProtuneWriter(options);

  if (format === OutputFormat.RACE_PAK)
    return new RacePakWriter(options);

  if (format === OutputFormat.WIN_DARAB)
    return new WinDarabWriter(options);

  throw new Error('Unknown output format')
}
