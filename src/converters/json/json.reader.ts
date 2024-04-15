import { BaseReader, BaseReaderStream } from '../../interfaces/base.reader';
import { Readable } from 'stream';
import { DataFrameStream } from '../../inputs/data-frame-stream';
import { JsonFormat } from './json-format';

export class JsonReader implements BaseReader {

  public get extensions(): string[] {
    return ['.json'];
  }

  public async createStream(readable: Readable): Promise<BaseReaderStream> {
    const json = await this.readJsonStream(readable);

    const stream = new DataFrameStream();
    stream.writeAll(json.frames);
    stream.end();

    return {
      stream: stream,
      channels: json.channels,
    };
  }

  protected async readJsonStream(readable: Readable): Promise<JsonFormat> {
    return new Promise((resolve, reject) => {
      let rawData = '';
      readable.on('data', (chunk) => rawData += chunk.toString());
      readable.once('end', () => {
        try {
          const parsedData = JSON.parse(rawData) as JsonFormat;

          const isValid = typeof parsedData === 'object' &&
            Array.isArray(parsedData.channels) &&
            Array.isArray(parsedData.frames);

          if (!isValid)
            return void reject(new Error('The parsed JSON data is not valid'));

          resolve(parsedData);
        } catch (error) {
          reject(error);
        }
      });
    });
  }

}

