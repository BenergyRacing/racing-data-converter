import { MeteorReader, MeteorWriter } from '../../src';
import { frames1 } from '../data/frames1';
import { getDataFrameStreamResult } from '../data/utils';
import { DataFrameStream } from '../../src/inputs/data-frame-stream';

test('meteor writer to reader', async () => {
  const writer = new MeteorWriter({
    spec: frames1.meteorSpec,
  });

  const input = new DataFrameStream();
  input.writeAll(frames1.frames);
  input.end();

  const output = writer.createStream(input);

  const reader = new MeteorReader({
    spec: frames1.meteorSpec,
  });

  const stream = await reader.createStream(output);
  const result = await getDataFrameStreamResult(stream.stream);

  expect(result).toStrictEqual(frames1.frames);
});
