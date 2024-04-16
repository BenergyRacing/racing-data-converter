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

    if (opt.mainComment) {
      header += '#MAINCOMMENT\n';
      header += formatProtuneMultilineString(opt.mainComment);
      header += '#ENDMAINCOMMENT\n';
    }

    if (opt.logId) {
      header += '#LOGID\n';
      header += formatProtuneMultilineString(opt.logId);
      header += '#ENDLOGID\n';
    }

    if (opt.dashVersion) {
      header += '#DASHVERSION\n';
      header += formatProtuneMultilineString(opt.dashVersion);
      header += '#ENDDASHVERSION\n';
    }

    if (opt.filterChannel) {
      header += '#FILTERCHANNEL\n';
      header += formatProtuneMultilineString(opt.filterChannel);
      header += '#ENDFILTERCHANNEL\n';
    }

    if (opt.dashTriggerPoint) {
      header += '#DASHTRIGGERPOINT\n';
      header += formatProtuneMultilineString(opt.dashTriggerPoint);
      header += '#ENDDASHTRIGGERPOINT\n';
    }

    if (opt.dashReferencePoints) {
      header += '#DASHREFERENCESPOINTS\n';
      header += formatProtuneMultilineString(opt.dashReferencePoints);
      header += '#ENDDASHREFERENCESPOINTS\n';
    }

    if (opt.numberOfShows !== undefined)
      header += '#NUMBEROFSHOWS ' + formatProtuneNumber(opt.numberOfShows, 0) + '\n';

    if (opt.trackLabel)
      header += '#TRACKLABEL ' + formatProtuneString(opt.trackLabel) + '\n';

    if (opt.maxSpeed !== undefined)
      header += '#MAXSPEED ' + formatProtuneNumber(opt.maxSpeed, 1) + '\n';

    if (opt.bestLap !== undefined)
      header += '#BESTLAP ' + formatProtuneNumber(opt.bestLap, 0) + '\n';

    if (opt.numberOfLaps !== undefined)
      header += '#NUMBEROFLAPS ' + formatProtuneNumber(opt.numberOfLaps, 0) + '\n';

    header += '#DATASTART\n';

    // Columns
    header += 'Datalog Time;';
    header += this.options.channels.map(channel => formatProtuneChannelName(channel) + ';').join('');
    header += '\n';

    // Units
    header += 'seg.;';
    header += this.options.channels.map(channel => formatProtuneUnit(channel) + ';').join('');
    header += '\n';

    return header;
  }

}
