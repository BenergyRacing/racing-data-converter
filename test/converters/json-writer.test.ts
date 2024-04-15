import { CsvWriter, JsonFormat, JsonWriter } from '../../src';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `{
  "channels": [
    {
      "key": "ch1",
      "name": "Channel 1"
    },
    {
      "key": "ch2",
      "name": "Channel 2",
      "unit": "m"
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
      "timestamp": 10,
      "value": 20
    },
    {
      "channel": "ch1",
      "timestamp": 10,
      "value": 30
    },
    {
      "channel": "ch1",
      "timestamp": 40,
      "value": 40
    },
    {
      "channel": "ch3",
      "timestamp": 40,
      "value": 0.142
    }
  ]
}`;

test('json conversion', async () => {
  const writer = new JsonWriter({
    channels: frames1.channels,
    indent: 2,
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
