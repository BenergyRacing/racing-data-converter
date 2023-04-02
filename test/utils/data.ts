import { DataChannelInterface } from '../../src/interfaces/data-channel.interface';
import { SensorChannelType } from '../../src/enums/sensor-channel.type';
import { PassThrough, Readable, Writable } from 'stream';
import { DataFrameInterface } from '../../src/interfaces/data-frame.interface';

export const testChannels: DataChannelInterface[] = [
  {
    key: SensorChannelType.ACCELERATION,
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
    } as DataFrameInterface);
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
