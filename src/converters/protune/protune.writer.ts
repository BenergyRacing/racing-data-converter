import { ProtuneWriterOptions } from './protune-writer.options';
import { BaseWriter } from '../../interfaces/base.writer';
import { Readable, Transform } from 'stream';
import {
  formatProtuneChannelName,
  formatProtuneMultilineString, formatProtuneNumber,
  formatProtuneString,
  formatProtuneUnit
} from './utils';
import { TimedFrameGrouper } from '../timed-frame-grouper';
import { StreamPrefixer } from '../stream-prefixer';
import { ProtuneGroupStream } from './protune-group-stream';
import { TimeFixer } from '../time-fixer';

export class ProtuneWriter implements BaseWriter {

  constructor(private readonly options: ProtuneWriterOptions) {}

  get extension(): string {
    return '.dlf';
  }

  public createStream(stream: Readable): Transform {
    const interval = Math.abs(this.options.interval || 10);

    const fixer = new TimeFixer();
    const grouper = new TimedFrameGrouper(interval);
    const protune = new ProtuneGroupStream(this.options.channels);
    const prefixer = new StreamPrefixer(this.createHeader());

    return stream.pipe(fixer).pipe(grouper).pipe(protune).pipe(prefixer);
  }

  protected createHeader(): string {
    const opt = this.options;
    let header = '';

    header += '#V2\n';
    header += '#SERIALNUMBER ' + formatProtuneString(opt.serialNumber) + '\n';
    header += '#MAINCOMMENT\n';
    header += formatProtuneMultilineString(opt.mainComment);
    header += '#ENDMAINCOMMENT\n';
    header += '#LOGID\n';
    header += formatProtuneMultilineString(opt.logId);
    header += '#ENDLOGID\n';
    header += '#DASHVERSION\n';
    header += formatProtuneMultilineString(opt.dashVersion || 'FW:05912');
    header += '#ENDDASHVERSION\n';
    header += '#FILTERCHANNEL\n';
    header += formatProtuneMultilineString(opt.filterChannel);
    header += '#ENDFILTERCHANNEL\n';
    header += '#DASHTRIGGERPOINT\n';
    header += formatProtuneMultilineString(opt.dashTriggerPoint);
    header += '#ENDDASHTRIGGERPOINT\n';
    header += '#DASHREFERENCESPOINTS\n';
    header += formatProtuneMultilineString(opt.dashReferencePoints);
    header += '#ENDDASHREFERENCESPOINTS\n';
    header += '#NUMBEROFSHOWS ' + formatProtuneNumber(opt.numberOfShows, 0) + '\n';
    header += '#TRACKLABEL ' + formatProtuneString(opt.trackLabel || 'Desconhecido') + '\n';
    header += '#MAXSPEED ' + formatProtuneString(opt.maxSpeed) + '\n';
    header += '#BESTLAP ' + formatProtuneNumber(opt.bestLap, 0) + '\n';
    header += '#NUMBEROFLAPS ' + formatProtuneNumber(opt.numberOfLaps, 0) + '\n';
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
