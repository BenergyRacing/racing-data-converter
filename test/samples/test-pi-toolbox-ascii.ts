import { createWriteStream } from 'fs';
import { createRandomDataStream, testChannels } from '../data/utils';
import { PiToolboxAsciiWriter } from '../../src/converters/pi-toolbox/pi-toolbox-ascii.writer';

const ascii = new PiToolboxAsciiWriter({
  channels: testChannels,
});

const data = createRandomDataStream();
const out = createWriteStream('./test/out/test-pi-toolbox-ascii' + ascii.extension);

ascii.createStream(data).pipe(out);
