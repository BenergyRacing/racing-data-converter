import { BaseWriter } from '../../interfaces/base.writer';
import { Readable, Transform } from 'stream';
import { StreamPrefixer } from '../stream-prefixer';
import { MlgWriterOptions, MlgType } from './mlg-writer.options';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { MlgBlockStream } from './mlg-block-stream';
import { mlvlgTypeByteSize, mlvlgTypeId } from './utils';

/**
 * Converts data frames into a EFI Analytics Binary MLG logging file (MLVLG).
 *
 * @see http://www.efianalytics.com/TunerStudio/docs/MLG_Binary_LogFormat_2.0.pdf
 */
export class MlgWriter implements BaseWriter {

  constructor(private readonly options: MlgWriterOptions) {}

  public get extension(): string {
    return '.mlg';
  }

  public createStream(stream: Readable): Transform {
    const blockByteLength = this.calculateBlockByteLength();

    const grouper = new TimedFrameGrouper(this.options.interval || 10);
    const blockify = new MlgBlockStream(this.options.channels, blockByteLength);
    const prefixer = new StreamPrefixer(this.createHeader(blockByteLength), true);

    return stream.pipe(grouper).pipe(blockify).pipe(prefixer);
  }

  protected createHeader(blockByteLength: number): Buffer {
    const timestamp = this.options.date ? Math.floor(this.options.date.getTime() / 1000) : 0;
    const channels = this.options.channels;
    const infoDataString = this.options.description;

    const format = Buffer.from([0x4D, 0x4C, 0x56, 0x4C, 0x47, 0x00]); // MLVLG\0
    const header = Buffer.alloc(18);

    header.writeUInt16BE(0x0002, 0); // Version 2
    header.writeUInt32BE(timestamp, 2); // Timestamp
    header.writeUInt32BE(0, 6); // Info Data Start
    header.writeUInt32BE(0, 10); // Data Begin Start
    header.writeUInt16BE(blockByteLength, 14); // Record Length
    header.writeUInt16BE(channels.length, 16); // Num Logger Fields

    const loggerFields = Buffer.alloc(89 * channels.length, 0);
    const bitFieldNames = Buffer.alloc(0); // TODO implement bit fields?

    for (let i = 0; i < channels.length; i++) {
      const baseOffset = 89 * i;
      const channel = channels[i];

      const type = mlvlgTypeId[channel.mlgType ?? MlgType.F32];
      const name = channel.name || channel.key;
      const unit = channel.unit || '';
      const scale = channel.scale ?? 1;
      const transform = channel.transform ?? 0;
      const decimalPlaces = channel.decimalPlaces ?? 2;
      const category = channel.category || '';

      // Scalar
      loggerFields.writeUInt8(type, baseOffset); // Type
      loggerFields.write(name.substring(0, 33).padEnd(34, '\0'), baseOffset + 1, 'ascii'); // Name
      loggerFields.write(unit.substring(0, 9).padEnd(10, '\0'), baseOffset + 35, 'ascii'); // Unit
      loggerFields.writeUInt8(0, baseOffset + 45); // Display Style (0 = float)
      loggerFields.writeFloatBE(scale, baseOffset + 46); // Scale
      loggerFields.writeFloatBE(transform, baseOffset + 50); // Transform
      loggerFields.writeInt8(decimalPlaces, baseOffset + 54); // Digits
      loggerFields.write(category.substring(0, 33).padEnd(34, '\0'), baseOffset + 55, 'ascii'); // Category
    }

    const sizeUntilInfoData = format.length + header.length + loggerFields.length + bitFieldNames.length;
    const infoData = Buffer.alloc(infoDataString ? infoDataString.length + 1 : 0);

    if (infoDataString) {
      header.writeUInt32BE(sizeUntilInfoData, 6); // Info Data Start
      infoData.write(infoDataString + '\0', 'ascii');
    }

    header.writeUInt32BE(sizeUntilInfoData + infoData.length, 10); // Data Begin Start

    return Buffer.concat([format, header, loggerFields, bitFieldNames, infoData]);
  }

  private calculateBlockByteLength(): number {
    let length = 0;

    for (const channel of this.options.channels) {
      const type = channel.mlgType ?? MlgType.F32;

      length += mlvlgTypeByteSize[type];
    }

    return length;
  }

}
