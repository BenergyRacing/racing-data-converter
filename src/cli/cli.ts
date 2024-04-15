#!/usr/bin/env node

import { Command, Option } from 'commander';
import { InputFormat } from './input';
import { OutputFormat } from './output';
import { runCli } from './index';

const program = new Command();

program
  .name('racing-data-converter')
  .description('Convert time series data into formats from popular motorsport data analysis software')
  .version('1.2.0')
  .showHelpAfterError()
  .argument('<input>', 'input file path')
  .argument('<output>', 'output file path')
  .addOption(
    new Option('-i, --input-format [format]', 'input file format')
      .choices([
        InputFormat.AUTO,
        InputFormat.CSV,
        InputFormat.BENERGY_METEOR,
        InputFormat.JSON,
      ])
      .default(InputFormat.AUTO)
  )
  .addOption(
    new Option('-o, --output-format [format]', 'output file format')
      .choices([
        OutputFormat.AUTO,
        OutputFormat.CSV,
        OutputFormat.EXCEL_CSV,
        OutputFormat.MEGA_SQUIRT,
        OutputFormat.MOTEC_CSV,
        OutputFormat.PI_TOOLBOX_ASCII,
        OutputFormat.PROTUNE,
        OutputFormat.RACE_PAK,
        OutputFormat.WIN_DARAB,
        OutputFormat.BENERGY_METEOR,
        OutputFormat.JSON,
      ])
      .default(OutputFormat.AUTO)
  )
  .addOption(
    new Option('--input-options-file [path]', 'input options json file')
      .default(null)
  )
  .addOption(
    new Option('--output-options-file [path]', 'output options json file')
      .default(null)
  )
  .action((inputFile, outputFile, opts) => {
    runCli({
      inputFile,
      outputFile,
      inputFormat: opts.inputFormat,
      outputFormat: opts.outputFormat,
      inputOptionsFile: opts.inputOptionsFile,
      outputOptionsFile: opts.outputOptionsFile,
    })
      .then(() => console.log('Done.'))
      .catch((error) => console.error(error));
  });

program.parse();
