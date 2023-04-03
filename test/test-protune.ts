import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from './utils/data';
import { ProtuneWriter } from '../src/converters/protune/protune.writer';

const protune = new ProtuneWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-protune' + protune.extension);

protune.createStream(data).pipe(out);
