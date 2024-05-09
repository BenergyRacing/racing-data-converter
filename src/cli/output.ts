import * as path from 'path';
import { BaseWriter } from '../interfaces/base.writer';
import {
  CsvWriter,
  CsvWriterOptions,
  ExcelCsvWriter,
  JsonWriter,
  MslWriter,
  MlgWriter,
  MeteorWriter,
  MotecCsvWriter,
  PiToolboxAsciiWriter,
  ProtuneWriter,
  RacePakWriter,
  WinDarabWriter,
} from '../index';

export enum OutputFormat {
  AUTO = 'auto',
  CSV = 'csv',
  EXCEL_CSV = 'excel-csv',
  MEGA_SQUIRT = 'mega-squirt', // TODO remove megasquirt in favor of msl
  MSL = 'msl',
  MLG = 'mlg',
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
    return [OutputFormat.MSL, {}];

  if (filename.endsWith('.mlg'))
    return [OutputFormat.MLG, {}];

  if (filename.endsWith('.json'))
    return [OutputFormat.JSON, {}];

  throw new Error('Could not find an output format based on the file extension.');
}

export function getOutputFilename(outputFile: string, inputFile: string, writer: BaseWriter): string {
  if (!outputFile.includes('@'))
    return outputFile;

  const suffix = outputFile.endsWith(writer.extension) ? '' : writer.extension;
  const basename = path.basename(inputFile);
  const outputName = outputFile.replace('@', basename + suffix);

  // In case the output file is the same as the input, we'll prefix it with an underline
  if (outputName === inputFile)
    return outputFile.replace('@', '_' + basename + suffix);

  return outputName;
}

export function createOutput(format: OutputFormat, options: any): BaseWriter {
  if (format === OutputFormat.CSV)
    return new CsvWriter(options);

  if (format === OutputFormat.EXCEL_CSV)
    return new ExcelCsvWriter(options);

  if (format === OutputFormat.MSL || format === OutputFormat.MEGA_SQUIRT)
    return new MslWriter(options);

  if (format === OutputFormat.MLG)
    return new MlgWriter(options);

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
