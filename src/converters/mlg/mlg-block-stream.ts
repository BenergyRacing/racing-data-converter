import { Transform, TransformCallback } from 'stream';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { MlgDataChannel, MlgType } from './mlg-writer.options';

// noinspection JSAnnotator
/**
 * A transform stream that encodes data frame objects in binary, in the Binary MLG Logging (MLVLG) format version 2.
 *
 * Note: This transformer does not support writing markers, only single standard data blocks.
 * The resulting data may not be as tightly optimized.
 */
export class MlgBlockStream extends Transform {

  private currentRecord: number = 0;

  constructor(
    private readonly channels: MlgDataChannel[],
    private readonly blockByteLength: number,
  ) {
    super({ writableObjectMode: true, readableObjectMode: false });
  }

  _transform(chunk: Record<string, number>, encoding: BufferEncoding, callback: TransformCallback) {
    const timestamp = chunk[TimedFrameGrouper.TIMESTAMP_CHANNEL];

    const data = Buffer.alloc(4 + this.blockByteLength + 1);

    // Header
    data.writeUInt8(0, 0); // Block Type (0 = standard)
    data.writeUInt8(this.currentRecord, 1); // Counter
    data.writeUInt16BE((timestamp * 100) & 0xFFFF, 2); // Timestamp in 10us resolution

    let offset = 4;

    // Block Data
    for (const channel of this.channels) {
      const type = channel.mlgType ?? MlgType.F32;
      const value = chunk[channel.key] ?? 0;

      if (type === MlgType.U08)
        offset = data.writeUInt8(value, offset);
      else if (type === MlgType.S08)
        offset = data.writeInt8(value, offset);
      else if (type === MlgType.U16)
        offset = data.writeUInt16BE(value, offset);
      else if (type === MlgType.S16)
        offset = data.writeInt16BE(value, offset);
      else if (type === MlgType.U32)
        offset = data.writeUInt32BE(value, offset);
      else if (type === MlgType.S32)
        offset = data.writeInt32BE(value, offset);
      else if (type === MlgType.S64)
        offset = data.writeBigInt64BE(BigInt(value), offset);
      else
        offset = data.writeFloatBE(value, offset);
    }

    // Checksum
    let checksum = 0;
    for (let i = 4; i < offset; i++) {
      checksum = (checksum + data[i]) % 256;
    }
    data.writeUInt8(checksum, offset);

    this.currentRecord = (this.currentRecord + 1) % 255;

    callback(null, data);
  }
}
