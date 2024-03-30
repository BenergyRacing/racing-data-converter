import { Readable } from 'stream';
import { MeteorParserStream } from './meteor-parser-stream';
import { MeteorReaderOptions } from './meteor-reader.options';
import { MeteorReaderStream } from './meteor-reader.stream';
import { BaseReader } from '../../interfaces/base.reader';
import { MeteorGeneralData } from './utils';

export class MeteorReader implements BaseReader {

  constructor(
    private readonly options: MeteorReaderOptions,
  ) {
    if (!options.spec)
      throw new Error('The meteor specification object must be defined');
  }

  get extensions(): string[] {
    return ['.b20', '.b24', '.bin', '.met'];
  }

  public createStream(stream: Readable): Promise<MeteorReaderStream> {
    return new Promise((resolve, reject) => {
      const parser = new MeteorParserStream(this.options.spec);

      parser.once('general', (general: MeteorGeneralData) => {
        resolve({
          ...general,
          channels: this.options.spec.topics,
          stream: parser,
        });
      });

      parser.once('error', (error) => reject(error));

      stream.pipe(parser);
    });
  }

}
