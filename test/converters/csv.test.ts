import { CsvWriter } from '../../src';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `Time (ms),Channel 1,Channel 2 (m),"Channel ""3"""
10,10,,
20,30,20,
50,40,20,0.142
`;

test('csv conversion', async () => {
  const writer = new CsvWriter({
    channels: frames1.channels,
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
