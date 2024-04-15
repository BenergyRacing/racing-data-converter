import { JsonReader } from '../../src';
import { PassThrough } from 'stream';
import { getDataFrameStreamResult } from '../data/utils';
import { frames2 } from '../data/frames2';

const frames2Result = `{
  "channels": [
    {
      "key": "ch1",
      "name": "Channel 1"
    },
    {
      "key": "ch2",
      "name": "Channel 2"
    },
    {
      "key": "ch3",
      "name": "Channel \\"3\\"",
      "decimalPlaces": 2
    }
  ],
  "frames": [
    {
      "channel": "ch1",
      "timestamp": 0,
      "value": 10
    },
    {
      "channel": "ch2",
      "timestamp": 0,
      "value": 0
    },
    {
      "channel": "ch3",
      "timestamp": 0,
      "value": 0
    },
    {
      "channel": "ch1",
      "timestamp": 10,
      "value": 30
    },
    {
      "channel": "ch2",
      "timestamp": 10,
      "value": 20
    },
    {
      "channel": "ch3",
      "timestamp": 10,
      "value": 0
    },
    {
      "channel": "ch1",
      "timestamp": 20,
      "value": 40
    },
    {
      "channel": "ch2",
      "timestamp": 20,
      "value": 20
    },
    {
      "channel": "ch3",
      "timestamp": 20,
      "value": 0.142
    }
  ]
}`;

test('json reader', async () => {
  const reader = new JsonReader();

  const input = new PassThrough({ encoding: 'utf-8' });

  input.write(frames2Result);
  input.end();

  const output = await reader.createStream(input);

  expect(output.channels).toStrictEqual(frames2.channels);

  const result = await getDataFrameStreamResult(output.stream);

  expect(result).toStrictEqual(frames2.frames);
});
