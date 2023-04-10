import { ExcelCsvWriter } from '../../src';
import { getWriterOutput } from '../utils/data';
import { frames1 } from './inputs/frames1';

const frames1Result = `sep=\t
Time (ms)\tChannel 1\tChannel 2 (m)\t"Channel ""3"""
10\t10\t\t
20\t30\t20\t
50\t40\t20\t0.142
`;

test('excel csv conversion', async () => {
  const writer = new ExcelCsvWriter({
    channels: frames1.channels,
    recordDelimiter: '\n',
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
