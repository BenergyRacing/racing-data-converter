import { BaseWriter } from '../interfaces/base.writer';
import {
  CsvWriter,
  ExcelCsvWriter,
  MegaSquirtWriter,
  MeteorWriter,
  MotecCsvWriter,
  PiToolboxAsciiWriter,
  ProtuneWriter,
  RacePakWriter,
  WinDarabWriter,
} from '../index';
import { DataChannel } from '../interfaces/data-channel';

export enum OutputFormat {
  CSV = 'csv',
  EXCEL_CSV = 'excel-csv',
  MEGA_SQUIRT = 'mega-squirt',
  MOTEC_CSV = 'motec-csv',
  PI_TOOLBOX_ASCII = 'pi-toolbox-ascii',
  PROTUNE = 'protune',
  RACE_PAK = 'race-pak',
  WIN_DARAB = 'win-darab',
  BENERGY_METEOR = 'benergy-meteor',
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

  if (format === OutputFormat.BENERGY_METEOR)
    return new MeteorWriter(options);

  throw new Error('Unknown output format')
}
