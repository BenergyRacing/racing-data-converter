import { BaseWriter } from '../../interfaces/base.writer';
import { Readable, Transform } from 'stream';
import { MeteorWriterOptions } from './meteor-writer.options';
import { TimeFixer } from '../time-fixer';
import { StreamPrefixer } from '../stream-prefixer';
import { MeteorFrameStream } from './meteor-frame-stream';
import { LogSignature } from './utils';

export class MeteorWriter implements BaseWriter {

  constructor(
    private readonly options: MeteorWriterOptions,
  ) {
  }

  get extension(): string {
    return '.met';
  }

  public createStream(stream: Readable): Transform {
    const fixer = new TimeFixer();
    const meteor = new MeteorFrameStream(this.options.spec);
    const prefixer = new StreamPrefixer(this.createHeader());

    return stream.pipe(fixer).pipe(meteor).pipe(prefixer);
  }

  private createHeader(): Buffer {
    const date = this.options.date ?? new Date();
    const timeOfDay = date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();

    const name = Buffer.from(this.options.name || 'LOG', 'utf-8');
    const generalInfo = Buffer.alloc(9);

    generalInfo.writeUInt8(2, 0); // Version 2
    generalInfo.writeUInt8(date.getDate(), 1);
    generalInfo.writeUInt8(date.getMonth(), 2);
    generalInfo.writeUInt8(date.getFullYear(), 3);
    generalInfo.writeUInt32BE(timeOfDay, 4);
    generalInfo.writeUInt8(name.length);

    return Buffer.concat([
      LogSignature,
      generalInfo,
      name,
    ]);
  }
}
