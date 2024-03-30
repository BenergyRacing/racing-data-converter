import { DataChannel } from '../../src/interfaces/data-channel';
import { SensorChannel } from '../../src/enums/sensor-channel';
import { Readable } from 'stream';
import { DataFrame } from '../../src/interfaces/data-frame';
import { BaseWriter } from '../../src/interfaces/base.writer';
import { DataFrameStream } from '../../src/inputs/data-frame-stream';

export const testChannels: DataChannel[] = [
  {
    key: SensorChannel.ACCELERATION,
    name: 'Acceleration'
  },
  {
    key: 'test',
    name: 'Test!'
  },
  {
    key: 'sine',
    name: 'Sine',
  },
];

export function writeRandomData(writable: DataFrameStream, timestamp: number): void {
  for (const channel of testChannels) {
    writable.write({
      channel: channel.key,
      timestamp: timestamp,
      value: channel.key === 'sine' ? Math.sin(timestamp / 1000 * Math.PI * 2) : Math.floor(1000 * Math.random()),
    } as DataFrame);
  }
}

export function createRandomDataStream(samples: number = 100, interval: number = 10): Readable {
  const passThrough = new DataFrameStream();

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

export function getDataFrameStreamResult(stream: Readable): Promise<DataFrame[]> {
  return new Promise((resolve, reject) => {
    let data: DataFrame[] = [];
    stream.on('data', chunk => data.push(chunk));
    stream.once('end', () => resolve(data));
    stream.once('error', err => reject(err));
  });
}

export function getBufferResult(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    let chunks: Buffer[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.once('end', () => resolve(Buffer.concat(chunks)));
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

