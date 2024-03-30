import { MeteorReader } from '../../src/converters/meteor/meteor.reader';
import { SensorChannel } from '../../src/enums/sensor-channel';
import { DataFormatType } from '../../src/converters/meteor/spec/data-format';
import { createWriteStream } from 'fs';
import { MeteorWriter } from '../../src';
import { createRandomDataStream } from '../data/utils';
import { frames1 } from '../data/frames1';

const reader = new MeteorReader({
  spec: {
    topics: [
      {
        key: SensorChannel.SPEED,
        id: 1,
        data: {
          type: DataFormatType.UnsignedNumber,
        },
      },
    ],
    composites: [],
  }
});

const writer = new MeteorWriter({
  spec: frames1.meteorSpec,
  name: 'Test',
});

const data = createRandomDataStream();
const out = createWriteStream('./test/samples/out/test-meteor' + writer.extension);

writer.createStream(data).pipe(out);
