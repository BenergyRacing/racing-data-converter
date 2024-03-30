import { MeteorReader } from '../../src';
import { PassThrough } from 'stream';
import { getDataFrameStreamResult, getStreamResult } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = Buffer.from('iUInRU5FUkdZDQoaCgIeAxgAAAAABFRlc3QAAAAAAQEBCgAAAAoBAgEUAAAACgEBAR4AAAAoAQEBKAAAACgBAwKOAA==', 'base64');

test('meteor reader', async () => {
  const reader = new MeteorReader({
    spec: frames1.meteorSpec,
  });

  const input = new PassThrough();

  input.write(frames1Result);
  input.end();

  const output = await reader.createStream(input);
  const result = await getDataFrameStreamResult(output.stream);

  expect(output.name).toBe('Test');
  expect(output.date?.toISOString()).toBe('2024-04-30T03:00:00.000Z');
  expect(result).toStrictEqual(frames1.frames);
});
