import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { CsvWriter } from '../../src/converters/csv/csv.writer';

const csv = new CsvWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-csv' + csv.extension);

csv.createStream(data).pipe(out);
