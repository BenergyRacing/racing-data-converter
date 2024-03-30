import { BaseWriter } from '../../interfaces/base.writer';
import { Readable, Transform } from 'stream';
import { MeteorWriterOptions } from './meteor-writer.options';
import { StreamPrefixer } from '../stream-prefixer';
import { MeteorFrameStream } from './meteor-frame-stream';
import { LogSignature } from './utils';

export class MeteorWriter implements BaseWriter {

  constructor(
    private readonly options: MeteorWriterOptions,
  ) {
    if (!options.spec)
      throw new Error('The meteor specification object must be defined');
  }

  get extension(): string {
    return '.met';
  }

  public createStream(stream: Readable): Transform {
    const meteor = new MeteorFrameStream(this.options.spec);
    const prefixer = new StreamPrefixer(this.createHeader(), true);

    return stream.pipe(meteor).pipe(prefixer);
  }

  private createHeader(): Buffer {
    const date = this.options.date ?? new Date();
    const timeOfDay = date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();

    let name = Buffer.from(this.options.name || 'LOG', 'utf-8');

    if (name.length > 0xFF)
      name = name.subarray(0, 0xFF);

    const generalInfo = Buffer.alloc(9);

    generalInfo.writeUInt8(2, 0); // Version 2
    generalInfo.writeUInt8(date.getDate(), 1);
    generalInfo.writeUInt8(date.getMonth(), 2);
    generalInfo.writeUInt8(date.getFullYear() - 2000, 3);
    generalInfo.writeUInt32BE(timeOfDay, 4);
    generalInfo.writeUInt8(name.length, 8);

    return Buffer.concat([
      LogSignature,
      generalInfo,
      name,
    ]);
  }
}
