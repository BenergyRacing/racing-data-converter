import { Transform, Writable } from 'stream';
import { FrameType, LogSignature, toDataFrame, toDataFrames } from './utils';
import { MeteorSpecification } from './spec/meteor-specification';
import { MeteorReaderStream } from './meteor-reader.stream';

enum ParserState {
  Signature = 0,
  GeneralInfo = 1,
  GeneralName = 2,
  FrameHeader = 3,
  FrameData = 4
}

export class MeteorParserStream extends Transform {

  private buffer: Buffer = Buffer.alloc(0);
  private state: ParserState = ParserState.Signature;

  private version: number = -1;
  private dateTime: Date | undefined = undefined;
  private nameLength: number = 0;
  private name: string = '';

  private frameTime: number = 0;
  private frameType: FrameType = FrameType.SINGLE_TOPIC;
  private frameTopic: number = 0;
  private frameLength: number = 0;

  constructor(
    private readonly spec: MeteorSpecification,
    private readonly rawBufferOutput?: Writable,
  ) {
    super({ readableObjectMode: true, writableObjectMode: false });
  }

  private writeRaw(type: string, end: number): void {
    if (this.rawBufferOutput) {
      this.rawBufferOutput.write({
        buffer: this.buffer.subarray(0, end),
        type: type
      });
    }
  }

  private parseSignature(): boolean {
    const buffer = this.buffer;

    if (buffer.byteLength < LogSignature.byteLength) {
      // Not enough data yet, we'll wait for more
      return false;
    }

    this.writeRaw('signature', LogSignature.byteLength);

    const signature = buffer.subarray(0, LogSignature.byteLength);

    if (!signature.equals(LogSignature)) {
      this.emit('error', new Error("Invalid file signature!"));
      this.end();
      return false;
    }

    this.buffer = buffer.subarray(LogSignature.byteLength);
    this.state = ParserState.GeneralInfo;

    return true;
  }

  private parseGeneralInfo(): boolean {
    const buffer = this.buffer;

    if (buffer.byteLength < 10) {
      // Not enough data yet, we'll wait for more
      return false;
    }

    this.writeRaw('general-info', 10);

    this.version = buffer.readUInt8(0);

    let day = buffer.readUInt8(1);
    let month = buffer.readUInt8(2);
    let year = buffer.readUInt8(3);
    let timeOfDay = buffer.readUInt32BE(4);

    if (year !== 0)
      this.dateTime = new Date(year + 2000, month, day, timeOfDay / 3600000 % 100, timeOfDay / 60000 % 100, timeOfDay / 1000 % 100, timeOfDay % 1000);

    this.nameLength = buffer.readUInt8(8);

    this.buffer = buffer.subarray(9);
    this.state = ParserState.GeneralName;

    return true;
  }

  private parseGeneralName(): boolean {
    const buffer = this.buffer;

    if (buffer.byteLength < this.nameLength) {
      // Not enough data yet, we'll wait for more
      return false;
    }

    this.writeRaw('general-name', this.nameLength);

    this.name = buffer.toString('utf8', 0, this.nameLength).replace('\0', '');

    this.emit('general', {
      version: this.version,
      date: this.dateTime,
      name: this.name,
    } as Omit<MeteorReaderStream, 'stream'>);

    this.buffer = buffer.subarray(this.nameLength);
    this.state = ParserState.FrameHeader;

    return true;
  }

  private parseFrameHeader(): boolean {
    const buffer = this.buffer;

    // Version 1 only supported single topics
    // Version 2 allows to choose between single topics or composites
    const length = this.version === 1 ? 6 : 7;

    if (buffer.byteLength < length) {
      // Not enough data yet, we'll wait for more
      return false;
    }

    this.writeRaw('frame-header', length);

    this.frameTime = buffer.readUInt32BE(0);

    let offset = 4;

    if (this.version === 1) {
      this.frameType = FrameType.SINGLE_TOPIC;
    } else {
      this.frameType = buffer.readUInt8(offset);
      offset++;
    }

    this.frameTopic = buffer.readUInt8(offset);
    this.frameLength = buffer.readUInt8(offset + 1);

    this.buffer = buffer.subarray(offset + 2);
    this.state = ParserState.FrameData;

    return true;
  }

  private parseFrameData(): boolean {
    const buffer = this.buffer;
    const length = this.frameLength;
    const bigEndian = this.version === 1;

    if (buffer.byteLength < length) {
      // Not enough data yet, we'll wait for more
      return false;
    }

    this.writeRaw('frame-data', length);

    // Creates the data frame and pushes it to the transform output
    if (this.frameType === FrameType.SINGLE_TOPIC) {
      this.push(toDataFrame(this.spec, this.frameTopic, this.frameTime, buffer, 0, length, bigEndian));
    } else if (this.frameType === FrameType.COMPOSITE) {
      toDataFrames(this.spec, this.frameTopic, this.frameTime, buffer, length, bigEndian)
        .forEach(frame => this.push(frame));
    } else {
      console.warn('Unknown frame type:', this.frameType);
    }

    this.buffer = buffer.subarray(length);
    this.state = ParserState.FrameHeader;

    return true;
  }

  _transform(chunk: Buffer, enc: any, done: () => void): void {
    // Concatenate the buffers for easier manipulation
    this.buffer = Buffer.concat([this.buffer, chunk]);

    let canParseMore = false;

    do {
      switch (this.state) {
        case ParserState.Signature:
          canParseMore = this.parseSignature();
          break;
        case ParserState.GeneralInfo:
          canParseMore = this.parseGeneralInfo();
          break;
        case ParserState.GeneralName:
          canParseMore = this.parseGeneralName();
          break;
        case ParserState.FrameHeader:
          canParseMore = this.parseFrameHeader();
          break;
        case ParserState.FrameData:
          canParseMore = this.parseFrameData();
          break;
      }
    } while (canParseMore);

    // Requests more data
    done();
  }

}
