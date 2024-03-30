import { Readable } from 'stream';
import { MeteorParserStream } from './meteor-parser-stream';
import { MeteorReaderOptions } from './meteor-reader.options';
import { MeteorReaderStream } from './meteor-reader.stream';
import { BaseReader } from '../../interfaces/base.reader';

export class MeteorReader implements BaseReader {

  constructor(
    private readonly options: MeteorReaderOptions,
  ) {
  }

  get extensions(): string[] {
    return ['.b20', '.b24', '.met'];
  }

  public createStream(stream: Readable): Promise<MeteorReaderStream> {
    return new Promise((resolve, reject) => {
      const parser = new MeteorParserStream(this.options.spec);

      parser.once('general', (general: Omit<MeteorReaderStream, 'stream'>) => {
        resolve({
          ...general,
          stream: parser,
        });
      });

      parser.once('error', (error) => reject(error));

      stream.pipe(parser);
    });
  }

}