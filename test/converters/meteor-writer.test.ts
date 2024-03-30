import { MeteorWriter } from '../../src';
import { getBufferResult } from '../data/utils';
import { frames1 } from '../data/frames1';
import { DataFrameStream } from '../../src/inputs/data-frame-stream';

const frames1Result = Buffer.from('iUInRU5FUkdZDQoaCgIeAxgAAAAABFRlc3QAAAAAAQEBCgAAAAoBAgEUAAAACgEBAR4AAAAoAQEBKAAAACgBAwKOAA==', 'base64');

test('meteor conversion', async () => {
  const writer = new MeteorWriter({
    spec: frames1.meteorSpec,
    name: 'Test',
    date: new Date('2024-04-30T03:00:00.000Z'),
  });

  const input = new DataFrameStream();
  const output = writer.createStream(input);

  input.writeAll(frames1.frames);
  input.end();

  const result = await getBufferResult(output);

  expect(result.toString('hex')).toBe(frames1Result.toString('hex'));
});
