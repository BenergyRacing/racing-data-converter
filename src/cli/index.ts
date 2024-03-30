import { parseDataChannelFromName } from '../utils/channels';
import { createInput, InputFormat } from './input';
import { createOutput, OutputFormat } from './output';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';

export interface CliOptions {
  inputFile: string;
  outputFile: string;
  inputFormat: string;
  outputFormat: string;
  inputOptionsFile?: string;
  outputOptionsFile?: string;
}

export async function runCli(options: CliOptions): Promise<void> {
  console.log(`Converting "${options.inputFile}" to "${options.outputFile}"`);
  console.log(`Format "${options.inputFormat}" to "${options.outputFormat}"`);
  console.log(`Options files "${options.inputOptionsFile || 'not set'}" to "${options.outputOptionsFile || 'not set'}"`);

  console.log('Preparing...');

  const inputOptions = await loadOptionsFile(options.inputOptionsFile);
  const outputOptions = await loadOptionsFile(options.outputOptionsFile);

  const reader = createInput(options.inputFormat as InputFormat, inputOptions);
  const inputFileStream = fs.createReadStream(options.inputFile);

  const readerStream = await reader.createStream(inputFileStream);
  const channels = readerStream.channels;

  const writer = createOutput(options.outputFormat as OutputFormat, channels, outputOptions);
  const outputFileStream = fs.createWriteStream(options.outputFile);

  const writerStream = writer.createStream(readerStream.stream);

  writerStream.pipe(outputFileStream);

  console.log('Converting...');

  return new Promise((resolve, reject) => {
    outputFileStream.once('finish', () => resolve());
    outputFileStream.once('error', (err) => reject(err));
  });
}

async function loadOptionsFile(path: string | undefined): Promise<object> {
  if (!path)
    return {};

  const rawData = await fsPromises.readFile(path, 'utf-8');

  if (!rawData)
    return {};

  const data = JSON.parse(rawData);

  if (typeof data !== 'object' || Array.isArray(data))
    throw new Error('The options must be an object');

  return data;
}
