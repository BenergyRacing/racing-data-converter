import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { ExcelCsvWriter } from '../../src/converters/excel/excel-csv.writer';

const csv = new ExcelCsvWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-excel-csv' + csv.extension);

csv.createStream(data).pipe(out);
