import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { MslWriter } from '../../src/converters/msl/msl.writer';

const csv = new MslWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/samples/out/test-msl' + csv.extension);

csv.createStream(data).pipe(out);
