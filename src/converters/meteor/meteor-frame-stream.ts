import { Transform, TransformCallback } from 'stream';
import { MeteorDataSpecification } from './spec/meteor-data-specification';
import { DataFrame } from '../../interfaces/data-frame';
import { FrameType, getBufferFromDataFrame } from './utils';

// noinspection JSAnnotator
/**
 * A transform stream that encodes data frame objects in binary, in the Meteor format version 2.
 *
 * Note: This transformer does not supports writing composites, only single frames.
 * The resulting data may not be as tightly optimized.
 */
export class MeteorFrameStream extends Transform {

  constructor(
    private readonly spec: MeteorDataSpecification,
  ) {
    super({ writableObjectMode: true, readableObjectMode: false });
  }

  _transform(chunk: DataFrame, encoding: BufferEncoding, callback: TransformCallback) {
    const topic = this.spec.topics.find(t => t.key === chunk.channel);

    if (!topic)
      return callback(new Error(`Topic ID was not found for "${ chunk.channel }"`));

    const data = getBufferFromDataFrame(topic, chunk.value);

    const header = Buffer.alloc(7);
    header.writeUInt32BE(chunk.timestamp, 0);
    header.writeUInt8(FrameType.SINGLE_TOPIC, 4);
    header.writeUInt8(topic.id, 5);
    header.writeUInt8(data.length, 6);

    callback(null, Buffer.concat([header, data]));
  }
}
