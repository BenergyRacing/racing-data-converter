import { MegaSquirtWriter, MotecCsvWriter } from '../../src';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `"Format","MoTeC CSV File",,,"Workbook",""
"Venue","",,,"Worksheet",""
"Vehicle","",,,"",""
"Driver","Daltinho",,,"Engine ID",""
"Device",""
"Comment","",,,"Session",""
"Log Date","01/01/2023",,,"Origin Time","0.000","s"
"Log Time","12:00:00 AM",,,"Start Time","0.000","s"
"Sample Rate","100.000","Hz",,"End Time","","s"
"Duration","","s",,"Start Distance","","m"
"Range","",,,"End Distance","","m"


"Time","Channel 1","Channel 2","Channel ""3"""
"s",,"m",
"0.010","10",,
"0.020","30","20",
"0.050","40","20","0.142"
`;

test('motec csv conversion', async () => {
  const writer = new MotecCsvWriter({
    channels: frames1.channels,
    driver: 'Daltinho',
    logDate: new Date(2023, 0, 1, 0, 0, 0),
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
