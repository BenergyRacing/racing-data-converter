import { DataChannel } from '../../src/interfaces/data-channel';
import { SensorChannel } from '../../src/enums/sensor-channel';
import { PassThrough, Readable, Writable } from 'stream';
import { DataFrame } from '../../src/interfaces/data-frame';
import { BaseWriter } from '../../src/interfaces/base.writer';
import { DataFrameStream } from '../../src/inputs/data-frame-stream';

export const testChannels: DataChannel[] = [
  {
    key: SensorChannel.ACCELERATION,
    name: 'Acceleration'
  },
  {
    key: 'negocio',
    name: 'Negocio!'
  },
];

export function writeRandomData(writable: Writable, timestamp: number): void {
  for (const channel of testChannels) {
    writable.write({
      channel: channel.key,
      timestamp: timestamp,
      value: Math.floor(1000 * Math.random()),
    } as DataFrame);
  }
}

export function createRandomDataStream(samples: number = 10, interval: number = 10): Readable {
  const passThrough = new PassThrough({ objectMode: true });

  for (let i = 0; i < samples; i++) {
    writeRandomData(passThrough, i * interval);
  }

  passThrough.end();

  return passThrough;
}

export function getStreamResult(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    stream.on('data', chunk => data += chunk);
    stream.once('end', () => resolve(data));
    stream.once('error', err => reject(err));
  });
}

export async function getWriterOutput(writer: BaseWriter, frames: DataFrame[]): Promise<string> {
  const input = new DataFrameStream();
  const output = writer.createStream(input);

  input.writeAll(frames);
  input.end();

  return await getStreamResult(output);
}
