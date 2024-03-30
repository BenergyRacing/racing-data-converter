import { DataFormat, DataFormatType } from './spec/data-format';
import { DataFrame } from '../../interfaces/data-frame';
import { MeteorSpecification, TopicMetadata } from './spec/meteor-specification';
import { MeteorReaderStream } from './meteor-reader.stream';

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

export function toDataFrame(spec: MeteorSpecification, topicId: number, timestamp: number, value: Buffer, offset: number, length: number, bigEndian: boolean = true): DataFrame {
  const topic = spec.topics.find(t => t.id === topicId);
  const channel = topic?.key ?? topicId.toString();

  if (length <= 0) {
    return {
      channel,
      timestamp,
      value: 0,
    };
  }

  const parsedValue = getDataFrameValue(topic, value, offset, length, bigEndian);

  return {
    channel,
    timestamp,
    value: parsedValue,
  };
}

export function toDataFrames(spec: MeteorSpecification, compositeId: number, timestamp: number, value: Buffer, length: number, bigEndian: boolean = true): DataFrame[] {
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
        value: 0,
      };
    }

    const parsedValue = getDataFrameValue(topic, value, offset, topicItem.length, bigEndian);

    offset += topicItem.length;

    return {
      channel: topicItem.key,
      timestamp,
      value: parsedValue,
    };
  });
}

export function getDataFrameValue(topic: TopicMetadata | undefined, value: Buffer, offset: number, length: number, bigEndian: boolean = true): number {
  const data = topic?.data;
  const type = data?.type ?? DataFormatType.UnsignedNumber;

  let valueNumber: number | bigint;

  if (type === DataFormatType.SignedNumber) {
    valueNumber = bigEndian
      ? (length === 8 ? value.readBigInt64BE(offset) : value.readIntBE(offset, length))
      : (length === 8 ? value.readBigInt64LE(offset) : value.readIntLE(offset, length));
  } else {
    valueNumber = bigEndian
      ? (length === 8 ? value.readBigUInt64BE(offset) : value.readUIntBE(offset, length))
      : (length === 8 ? value.readBigUInt64LE(offset) : value.readUIntLE(offset, length));
  }

  return convertToValue(valueNumber, data);
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


export function getDataByteSize(value: number, signed: boolean): number {
  value = Math.ceil(Math.abs(value)) * (signed ? 1 : 2);

  if (value < 0xFF) {
    return 1;
  } else if (value < 0xFFFF) {
    return 2;
  } else if (value < 0xFFFFFFFF) {
    return 4;
  } else {
    return 6;//8;
  }
}

export function convertFromValue(value: number | bigint, from: DataFormat | undefined): number {
  if (typeof value === 'bigint')
    value = Number(value);

  if (!from)
    return value;

  const addition: number = from.addition ?? 0;
  const divisor: number = from.divisor ?? 1;
  const multiplier: number = from.multiplier ?? 1;

  return (value / multiplier * divisor) - addition;
}

export function convertToValue(value: number | bigint, to: DataFormat | undefined): number {
  if (typeof value === 'bigint')
    value = Number(value);

  if (!to)
    return value;

  const addition: number = to.addition ?? 0;
  const divisor: number = to.divisor ?? 1;
  const multiplier: number = to.multiplier ?? 1;

  return (value + addition) / divisor * multiplier;
}
