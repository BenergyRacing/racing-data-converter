import * as fs from 'fs';
import { DataFrameStream } from '../../src/inputs/data-frame-stream';
import { ProtuneWriter } from '../../src/converters/protune';
import { SensorChannel } from '../../src/enums/sensor-channel';

// Creates a plain data frame stream
const dataFrameStream = new DataFrameStream();

// Creates a Protune writer with two channels
const writer = new ProtuneWriter({
  channels: [
    {
      key: SensorChannel.GPS_SPEED,
      name: 'Speed',
      unit: 'Km/h',
    },
    {
      key: 'happy-sensor',
      name: 'Happy Sensor',
      unit: 'm',
      decimalPlaces: 2,
    }
  ]
});

// Creates a Protune stream using the data frame stream as the input
const protuneStream = writer.createStream(dataFrameStream);

// Pipes the Protune stream into the output file
protuneStream.pipe(fs.createWriteStream('./test/samples/out/sample-output.dlf'));

// Writes a few data frames
dataFrameStream.write({
  channel: SensorChannel.GPS_SPEED,
  value: 53,
  timestamp: 0,
});

dataFrameStream.write({
  channel: 'happy-sensor',
  value: 3925,
  timestamp: 5,
});

dataFrameStream.write({
  channel: SensorChannel.GPS_SPEED,
  value: 59,
  timestamp: 10,
});

// Finishes writing
dataFrameStream.end();
