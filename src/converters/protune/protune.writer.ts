import { ProtuneWriterOptions } from './protune-writer.options';
import { BaseWriter } from '../../interfaces/base.writer';
import { Readable, Transform } from 'stream';
import { formatProtuneChannelName, formatProtuneString, formatProtuneUnit } from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { StreamPrefixer } from '../stream-prefixer';
import { ProtuneGroupStream } from './protune-group-stream';

export class ProtuneWriter implements BaseWriter {

  constructor(private readonly options: ProtuneWriterOptions) {}

  get extension(): string {
    return '.dlf';
  }

  public createStream(stream: Readable): Transform {
    const interval = Math.abs(this.options.interval || 10);

    const grouper = new TimedFrameGrouper(interval);
    const protune = new ProtuneGroupStream(this.options.channels);
    const prefixer = new StreamPrefixer(this.createHeader());

    return stream.pipe(grouper).pipe(protune).pipe(prefixer);
  }

  protected createHeader(): string {
    let header = '';

    header += '#V2\n';
    header += '#SERIALNUMBER ' + formatProtuneString(this.options.serialNumber) + '\n';
    header += '#MAINCOMMENT\n';
    header += '#ENDMAINCOMMENT\n';
    header += '#LOGID\n';
    header += '\n\n\n';
    header += '#ENDLOGID\n';
    header += '#DASHVERSION\n';
    header += 'FW:05912\n';
    header += '#ENDDASHVERSION\n';
    header += '#FILTERCHANNEL\n';
    header += '\n';
    header += '#ENDFILTERCHANNEL\n';
    header += '#DASHTRIGGERPOINT\n';
    header += '\n';
    header += '#ENDDASHTRIGGERPOINT\n';
    header += '#DASHREFERENCESPOINTS\n';
    header += '\n';
    header += '#ENDDASHREFERENCESPOINTS\n';
    header += '#NUMBEROFSHOWS \n';
    header += '#TRACKLABEL Desconhecido\n';
    header += '#MAXSPEED \n';
    header += '#BESTLAP \n';
    header += '#NUMBEROFLAPS \n';
    header += '#DATASTART\n';

    // Columns
    header += 'Datalog Time ; ';
    header += this.options.channels.map(channel => formatProtuneChannelName(channel) + ' ; ').join('');
    header += '\n';

    // Units
    header += 'seg. ; ';
    header += this.options.channels.map(channel => formatProtuneUnit(channel) + ' ; ').join('');
    header += '\n';

    return header;
  }

}
