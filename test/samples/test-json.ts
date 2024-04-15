import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { JsonWriter } from '../../src';

const json = new JsonWriter({
  channels: testChannels,
  indent: 2,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/samples/out/test-json' + json.extension);

json.createStream(data).pipe(out);
