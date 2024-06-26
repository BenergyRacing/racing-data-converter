import { ProtuneWriter } from '../../src/converters/protune';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `#V2
#SERIALNUMBER 
#DASHVERSION
FW:05912
#ENDDASHVERSION
#TRACKLABEL ECPA
#DATASTART
Datalog Time;Channel 1;Channel 2;Channel "3";
seg.;;m;;
0,000A10,00A0,00A0,00
0,010A30,00A20,00A0,00
0,040A40,00A20,00A0,14
`;

test('protune conversion', async () => {
  const writer = new ProtuneWriter({
    channels: frames1.channels,
    dashVersion: 'FW:05912',
    trackLabel: 'ECPA',
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
