import { ProtuneWriter } from '../../src/converters/protune';
import { getWriterOutput } from '../utils/data';
import { frames1 } from './inputs/frames1';

const frames1Result = `#V2
#SERIALNUMBER 
#MAINCOMMENT
#ENDMAINCOMMENT
#LOGID
#ENDLOGID
#DASHVERSION
FW:05912
#ENDDASHVERSION
#FILTERCHANNEL
#ENDFILTERCHANNEL
#DASHTRIGGERPOINT
#ENDDASHTRIGGERPOINT
#DASHREFERENCESPOINTS
#ENDDASHREFERENCESPOINTS
#NUMBEROFSHOWS 
#TRACKLABEL ECPA
#MAXSPEED 
#BESTLAP 
#NUMBEROFLAPS 
#DATASTART
Datalog Time ; Channel 1 ; Channel 2 ; Channel "3" ; 
seg. ;  ; m ;  ; 
0,010A10,00AA
0,020A30,00A20,00A
0,050A40,00A20,00A0,14
$`;

test('protune conversion', async () => {
  const writer = new ProtuneWriter({
    channels: frames1.channels,
    dashVersion: 'FW:05912',
    trackLabel: 'ECPA',
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});
