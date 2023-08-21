import { Command, Option } from 'commander';
import { InputFormat } from './input';
import { OutputFormat } from './output';
import { runCli } from './index';

const program = new Command();

program
  .name('racing-data-converter')
  .description('CLI to convert racing data into data analysis software formats')
  .version('1.0.0')
  .argument('<input>', 'input file path')
  .argument('<output>', 'output file path')
  .addOption(
    new Option('-i, --input-format [format]', 'input file format')
      .choices([InputFormat.CSV])
      .default(InputFormat.CSV)
  )
  .addOption(
    new Option('-o, --output-format [format]', 'output file format')
      .choices([
        OutputFormat.CSV,
        OutputFormat.EXCEL_CSV,
        OutputFormat.MEGA_SQUIRT,
        OutputFormat.MOTEC_CSV,
        OutputFormat.PI_TOOLBOX_ASCII,
        OutputFormat.PROTUNE,
        OutputFormat.RACE_PAK,
        OutputFormat.WIN_DARAB,
      ])
      .default(OutputFormat.CSV)
  )
  .addOption(
    new Option('--input-options [options]', 'input options json object')
      .default(null)
  )
  .addOption(
    new Option('--output-options [options]', 'output options json object')
      .default(null)
  )
  .action((inputFile, outputFile, opts) => {
    runCli({
      inputFile,
      outputFile,
      inputFormat: opts.inputFormat,
      outputFormat: opts.outputFormat,
      inputOptions: opts.inputOptions,
      outputOptions: opts.outputOptions,
    })
      .then(() => console.log('Done.'))
      .catch((error) => console.error(error));
  });

program.parse();
