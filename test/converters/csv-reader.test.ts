import { CsvReader } from '../../src';
import { PassThrough } from 'stream';
import { getDataFrameStreamResult } from '../data/utils';
import { frames2 } from '../data/frames2';

const frames2Result = `Time (ms),Channel 1,Channel 2,"Channel ""3"""
0,10,0,0
10,30,20,0
20,40,20,0.142
`;

test('csv reader', async () => {
  const reader = new CsvReader({
    timeColumn: 'Time (ms)',
    columnToChannelMap: column => frames2.channels.find(ch => column === ch.name)?.key,
  });

  const input = new PassThrough({ encoding: 'utf-8' });

  input.write(frames2Result);
  input.end();

  const output = await reader.createStream(input);

  const result = await getDataFrameStreamResult(output.stream);

  expect(result).toStrictEqual(frames2.frames);
});
