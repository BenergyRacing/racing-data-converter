import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { WinDarabWriter } from '../../src/converters/win-darab/win-darab.writer';

const windarab = new WinDarabWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-win-darab' + windarab.extension);

windarab.createStream(data).pipe(out);
