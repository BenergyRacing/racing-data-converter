import { PiToolboxAsciiWriter } from '../../src/converters/pi-toolbox';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `PiToolboxVersionedASCIIDataSet
Version\t2

{OutingInformation}
CarName\t
DriverName\tDaltinho
EngineTest\tFalse
FirstLapNumber\t0
LongComment\t
OutingNumber\t0
SessionNumber\t0
ShortComment\t
TrackName\t

{ChannelBlock}
Time\tChannel 1\tChannel 2[m]\t"Channel ""3"""
0\t10\t\t
10\t30\t20\t
40\t40\t20\t0.142
`;

test('pi toolbox ascii conversion', async () => {
  const writer = new PiToolboxAsciiWriter({
    channels: frames1.channels,
    driverName: 'Daltinho',
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
