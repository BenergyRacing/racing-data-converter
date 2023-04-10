import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { MegaSquirtWriter } from '../../src/converters/mega-squirt/mega-squirt.writer';

const csv = new MegaSquirtWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-mega-squirt' + csv.extension);

csv.createStream(data).pipe(out);
