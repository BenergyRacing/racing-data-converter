import { RacePakWriter } from '../../src/converters/race-pak';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';
import { formatRacePakNumber } from '../../src/converters/race-pak/utils';

const frames1Result = `Time,Channel 1,Channel 2,"Channel ""3"""
0.0000,10.00,,
0.0100,30.00,20.00,
0.0400,40.00,20.00,0.142
`;

test('racepak conversion', async () => {
  const writer = new RacePakWriter({
    channels: frames1.channels,
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});

test('racepak number formatting', () => {
  expect(formatRacePakNumber(10.51242)).toBe('10.5124');
  expect(formatRacePakNumber(10.5)).toBe('10.50');
  expect(formatRacePakNumber(10.5, 0)).toBe('10.5');
  expect(formatRacePakNumber(10)).toBe('10.00');
});
