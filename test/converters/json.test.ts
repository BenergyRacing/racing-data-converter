import { JsonReader, JsonWriter } from '../../src';
import { frames2 } from '../data/frames2';
import { getDataFrameStreamResult } from '../data/utils';
import { DataFrameStream } from '../../src/inputs/data-frame-stream';

test('json writer to reader', async () => {
  const writer = new JsonWriter({
    channels: frames2.channels,
  });

  const input = new DataFrameStream();
  input.writeAll(frames2.frames);
  input.end();

  const output = writer.createStream(input);

  const reader = new JsonReader();

  const stream = await reader.createStream(output);

  expect(stream.channels).toStrictEqual(frames2.channels);

  const result = await getDataFrameStreamResult(stream.stream);

  expect(result).toStrictEqual(frames2.frames);
});
