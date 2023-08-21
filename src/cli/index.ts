import { parseDataChannelFromName } from '../utils/channels';
import { createInput, InputFormat } from './input';
import { createOutput, OutputFormat } from './output';
import * as fs from 'fs';

export interface CliOptions {
  inputFile: string;
  outputFile: string;
  inputFormat: string;
  outputFormat: string;
  inputOptions?: string;
  outputOptions?: string;
}

export async function runCli(options: CliOptions): Promise<void> {
  const inputOptions = options.inputOptions ? JSON.parse(options.inputOptions) : {};
  const outputOptions = options.outputOptions ? JSON.parse(options.outputOptions) : {};

  const reader = createInput(options.inputFormat as InputFormat, inputOptions);
  const inputFileStream = fs.createReadStream(options.inputFile);

  const readerStream = await reader.createStream(inputFileStream);
  const channels = readerStream.columns.map(parseDataChannelFromName);

  const writer = createOutput(options.outputFormat as OutputFormat, channels, outputOptions);
  const outputFileStream = fs.createWriteStream(options.outputFile);

  const writerStream = writer.createStream(readerStream.stream);

  writerStream.pipe(outputFileStream);

  return new Promise((resolve, reject) => {
    outputFileStream.once('finish', () => resolve());
    outputFileStream.once('error', (err) => reject(err));
  });
}
