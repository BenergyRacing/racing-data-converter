import { CsvWriter } from '../../src';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `Time (ms),Channel 1,Channel 2 (m),"Channel ""3"""
0,10,,
10,30,20,
40,40,20,0.142
`;

test('csv conversion', async () => {
  const writer = new CsvWriter({
    channels: frames1.channels,
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
