import { DataFormat, DataFormatType } from './spec/data-format';
import { DataFrame } from '../../interfaces/data-frame';
import { MeteorDataSpecification, TopicMetadata } from './spec/meteor-data-specification';
import { MeteorReaderStream } from './meteor-reader.stream';

/**
 * This is the log signature, it is a fixed set of bytes contained in the start of every Meteor log file.
 * It was based off the PNG file signature.
 */
export const LogSignature = Buffer.from([
  0x89,
  0x42, 0x27, 0x45, 0x4e, 0x45, 0x52, 0x47, 0x59,
  0x0d, 0x0a, 0x1a, 0x0a
]);

export enum FrameType {
  SINGLE_TOPIC = 1,
  COMPOSITE = 2,
}

export type MeteorGeneralData = Omit<Omit<MeteorReaderStream, 'stream'>, 'channels'>;

/**
 * Reads a value from a Meteor topic data frame and converts it into a single data frame object
 *
 * @param spec The meteor data specification
 * @param topicId The topic identification
 * @param timestamp The timestamp in milliseconds
 * @param buffer The value buffer
 * @param length The length of the value
 * @param bigEndian Whether it should be parsed as big endian or little endian
 */
export function toDataFrame(
  spec: MeteorDataSpecification,
  topicId: number,
  timestamp: number,
  buffer: Buffer,
  length: number,
  bigEndian: boolean = true,
): DataFrame {
  const topic = spec.topics.find(t => t.id === topicId);
  const channel = topic?.key ?? topicId.toString();
  const value = getDataFrameValue(topic, buffer, 0, length, bigEndian);

  return {
    channel,
    timestamp,
    value,
  };
}

/**
 * Reads a value from a Meteor composite data frame and converts it into multiple data frame objects
 *
 * @param spec The meteor data specification
 * @param compositeId The composite identification
 * @param timestamp The timestamp in milliseconds
 * @param buffer The value buffer
 * @param length The length of the value
 * @param bigEndian Whether it should be parsed as big endian or little endian
 */
export function toDataFrames(
  spec: MeteorDataSpecification,
  compositeId: number,
  timestamp: number,
  buffer: Buffer,
  length: number,
  bigEndian: boolean = true,
): DataFrame[] {
  const composite = spec.composites.find(c => c.id === compositeId);

  if (!composite) {
    console.warn('Composite not found:', compositeId);
    return [];
  }

  let offset = 0;

  return composite.topics.map(topicItem => {
    const topic = spec.topics.find(t => t.key === topicItem.key);

    if (offset + topicItem.length > length) {
      console.warn('Composite incomplete:', compositeId, timestamp, length);

      return {
        channel: topicItem.key,
        timestamp,
        value: NaN,
      };
    }

    const value = getDataFrameValue(topic, buffer, offset, topicItem.length, bigEndian);

    offset += topicItem.length;

    return {
      channel: topicItem.key,
      timestamp,
      value,
    };
  });
}

/**
 * Reads a Meteor data frame value and parses it into a number
 *
 * @param topic The topic metadata
 * @param buffer The value buffer
 * @param offset The value offset
 * @param length The value length
 * @param bigEndian Whether the value must be read in big endian or little endian
 */
export function getDataFrameValue(
  topic: TopicMetadata | undefined,
  buffer: Buffer,
  offset: number,
  length: number,
  bigEndian: boolean = true,
): number {
  if (length <= 0 || buffer.length < offset + length)
    return NaN;

  const data = topic?.data;
  const type = data?.type ?? DataFormatType.UnsignedNumber;

  let value: number | bigint;

  if (type === DataFormatType.SignedNumber) {
    value = bigEndian
      ? (length === 8 ? buffer.readBigInt64BE(offset) : buffer.readIntBE(offset, length))
      : (length === 8 ? buffer.readBigInt64LE(offset) : buffer.readIntLE(offset, length));
  } else {
    value = bigEndian
      ? (length === 8 ? buffer.readBigUInt64BE(offset) : buffer.readUIntBE(offset, length))
      : (length === 8 ? buffer.readBigUInt64LE(offset) : buffer.readUIntLE(offset, length));
  }

  return convertToValue(value, data);
}

export function getBufferFromDataFrame(topic: TopicMetadata, value: number): Buffer {
  value = Math.round(convertFromValue(value, topic.data));

  const signed = topic.data.type === DataFormatType.SignedNumber;
  const length = getDataByteSize(value, signed);

  const buffer = Buffer.alloc(length);

  if (signed) {
    if (length === 8)
      buffer.writeBigInt64LE(BigInt(value));
    else
      buffer.writeIntLE(value, 0, length);
  } else {
    if (length === 8)
      buffer.writeBigInt64LE(BigInt(value));
    else
      buffer.writeUIntLE(value, 0, length);
  }

  return buffer;
}

/**
 * Calculates the minimum byte length for a number
 *
 * @param value The number that must be encoded
 * @param signed Whether it is signed or unsigned
 */
export function getDataByteSize(value: number, signed: boolean): number {
  value = Math.ceil(Math.abs(value)) * (signed ? 1 : 2);

  if (value < 0xFF) {
    return 1;
  } else if (value < 0xFFFF) {
    return 2;
  } else if (value < 0xFFFFFFFF) {
    return 4;
  } else {
    // We will consider up to six bytes as we don't support bigints
    // TODO: bigint support?
    return 6;
  }
}

/**
 * Converts a number from its data format
 *
 * @param value The number
 * @param from The data format
 */
export function convertFromValue(value: number | bigint, from: DataFormat | undefined): number {
  // TODO: bigint support?
  if (typeof value === 'bigint')
    value = Number(value);

  if (!from)
    return value;

  const addition: number = from.addition ?? 0;
  const divisor: number = from.divisor ?? 1;
  const multiplier: number = from.multiplier ?? 1;

  return (value / multiplier * divisor) - addition;
}

/**
 * Converts a number into its data format
 *
 * @param value The number
 * @param to The data format
 */
export function convertToValue(value: number | bigint, to: DataFormat | undefined): number {
  // TODO: bigint support?
  if (typeof value === 'bigint')
    value = Number(value);

  if (!to)
    return value;

  const addition: number = to.addition ?? 0;
  const divisor: number = to.divisor ?? 1;
  const multiplier: number = to.multiplier ?? 1;

  return (value + addition) / divisor * multiplier;
}
