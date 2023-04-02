import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from './utils/data';
import { ProtuneWriter } from '../src/converters/protune/protune.writer';

const csv = new ProtuneWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-protune' + csv.extension);

csv.createStream(data).pipe(out);
