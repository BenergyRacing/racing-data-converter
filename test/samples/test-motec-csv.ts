import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { MotecCsvWriter } from '../../src/converters/motec/motec-csv.writer';

const csv = new MotecCsvWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/samples/out/test-motec-csv' + csv.extension);

csv.createStream(data).pipe(out);
