import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from './utils/data';
import { RacePakWriter } from '../src/converters/race-pak/race-pak.writer';

const csv = new RacePakWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-race-pak' + csv.extension);

csv.createStream(data).pipe(out);
