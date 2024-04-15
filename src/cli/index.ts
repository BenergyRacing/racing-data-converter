import { createInput, getInputFormatAndOptions, InputFormat } from './input';
import { createOutput, getOutputFilename, getOutputFormatAndOptions, OutputFormat } from './output';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import * as path from 'path';

export interface CliOptions {
  inputFile: string;
  outputFile: string;
  inputFormat: string;
  outputFormat: string;
  inputOptionsFile?: string;
  outputOptionsFile?: string;
  directory?: boolean;
}

interface ConversionOptions {
  inputFile: string;
  outputFile: string;
  inputFormat: InputFormat;
  outputFormat: OutputFormat;
  inputOptions: object;
  outputOptions: object;
}

export async function runCli(options: CliOptions): Promise<void> {
  const conversionOptions = await prepare(options);

  if (options.directory)
    await convertDirectory(conversionOptions);
  else
    await convert(conversionOptions);
}

export async function prepare(options: CliOptions): Promise<ConversionOptions> {
  const [inFormat, defaultInOpts] = getInputFormatAndOptions(options.inputFormat, options.inputFile);
  const [outFormat, defaultOutOpts] = getOutputFormatAndOptions(options.outputFormat, options.outputFile);

  console.log(`Format "${inFormat}" to "${outFormat}"`);
  console.log(`Options files "${options.inputOptionsFile || 'not set'}" to "${options.outputOptionsFile || 'not set'}"`);

  console.log('Preparing...');

  const inputOptions = await loadOptionsFile(options.inputOptionsFile);
  const outputOptions = await loadOptionsFile(options.outputOptionsFile);

  return {
    inputFile: options.inputFile,
    outputFile: options.outputFile,
    inputFormat: inFormat,
    outputFormat: outFormat,
    inputOptions: { ...defaultInOpts, ...inputOptions },
    outputOptions: { ...defaultOutOpts, ...outputOptions },
  };
}

export async function convert(options: ConversionOptions): Promise<void> {
  const reader = createInput(options.inputFormat, options.inputOptions);
  const inputFileStream = fs.createReadStream(options.inputFile);

  const readerStream = await reader.createStream(inputFileStream);
  const channels = readerStream.channels;

  const writer = createOutput(options.outputFormat, { ...options.outputOptions, channels });
  const outputFile = getOutputFilename(options.outputFile, options.inputFile, writer);

  await fsPromises.mkdir(path.dirname(outputFile));

  const outputFileStream = fs.createWriteStream(outputFile);

  const writerStream = writer.createStream(readerStream.stream);

  writerStream.pipe(outputFileStream);

  console.log(`Converting "${options.inputFile}" to "${outputFile}"`);

  return new Promise((resolve, reject) => {
    outputFileStream.once('finish', () => resolve());
    outputFileStream.once('error', (err) => reject(err));
  });
}

export async function convertDirectory(options: ConversionOptions): Promise<void> {
  const inputDirents = await fsPromises.readdir(options.inputFile, { withFileTypes: true });
  const inputFiles = inputDirents.filter(dirent => dirent.isFile());

  if (inputFiles.length === 0)
    console.log('No files found in the directory');

  for (const file of inputFiles) {
    console.log(`File: "${file.name}"`);

    try {
      await convert({
        ...options,
        inputFile: path.join(options.inputFile, file.name),
        outputFile: path.join(options.outputFile, '@'),
      });
    } catch (error) {
      console.error(error?.toString());
    }
  }
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
