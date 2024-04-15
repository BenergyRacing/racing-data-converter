import { BaseWriter } from '../interfaces/base.writer';
import {
  CsvWriter,
  CsvWriterOptions,
  ExcelCsvWriter,
  JsonWriter,
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
  AUTO = 'auto',
  CSV = 'csv',
  EXCEL_CSV = 'excel-csv',
  MEGA_SQUIRT = 'mega-squirt',
  MOTEC_CSV = 'motec-csv',
  PI_TOOLBOX_ASCII = 'pi-toolbox-ascii',
  PROTUNE = 'protune',
  RACE_PAK = 'race-pak',
  WIN_DARAB = 'win-darab',
  BENERGY_METEOR = 'benergy-meteor',
  JSON = 'json',
}

export function getOutputFormatAndOptions(format: string, filename: string): [OutputFormat, any] {
  if (format !== OutputFormat.AUTO)
    return [format as OutputFormat, {}];

  filename = filename.toLowerCase();

  if (filename.endsWith('.csv'))
    return [OutputFormat.CSV, {}];

  if (filename.endsWith('.tsv'))
    return [OutputFormat.CSV, { delimiter: '\t' } as CsvWriterOptions];

  if (filename.endsWith('.met'))
    return [OutputFormat.BENERGY_METEOR, {}];

  if (filename.endsWith('.dlf'))
    return [OutputFormat.PROTUNE, {}];

  if (filename.endsWith('.msl'))
    return [OutputFormat.MEGA_SQUIRT, {}];

  if (filename.endsWith('.json'))
    return [OutputFormat.JSON, {}];

  throw new Error('Could not find an output format based on the file extension.');
}

export function createOutput(format: OutputFormat, options: any): BaseWriter {
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

  if (format === OutputFormat.JSON)
    return new JsonWriter(options);

  throw new Error('Unknown output format');
}
