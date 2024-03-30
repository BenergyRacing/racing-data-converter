import { CsvReader, CsvWriter } from '../../src';
import { frames2 } from '../data/frames2';
import { getDataFrameStreamResult } from '../data/utils';
import { DataFrameStream } from '../../src/inputs/data-frame-stream';

test('csv writer to reader', async () => {
  const writer = new CsvWriter({
    channels: frames2.channels,
    timeColumn: 'Timestamp',
    delimiter: ',',
    interval: 10,
  });

  const input = new DataFrameStream();
  input.writeAll(frames2.frames);
  input.end();

  const output = writer.createStream(input);

  const reader = new CsvReader({
    timeColumn: 'Timestamp',
    delimiter: ',',
    columnToChannelMap: column => frames2.channels.find(ch => column === ch.name)?.key,
  });

  const stream = await reader.createStream(output);
  const result = await getDataFrameStreamResult(stream.stream);

  expect(result).toStrictEqual(frames2.frames);
});
