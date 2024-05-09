import { MslWriter } from '../../src';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `Time (ms)\tChannel 1\tChannel 2 (m)\t"Channel ""3"""
0\t10\t\t
10\t30\t20\t
40\t40\t20\t0.142
`;

test('megasquirt conversion', async () => {
  const writer = new MslWriter({
    channels: frames1.channels,
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
