import { Transform, TransformCallback } from 'stream';

// noinspection JSAnnotator
export class StreamPrefixer extends Transform {

  private hasPrefixed: boolean = false;

  constructor(
    private readonly prefix: Buffer | string,
    isBinary: boolean = false,
  ) {
    super({ objectMode: false, decodeStrings: isBinary });
  }

  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback): void {
    if (this.hasPrefixed) {
      return callback(null, chunk);
    }

    let result: Buffer | string;

    if (Buffer.isBuffer(chunk)) {
      result = Buffer.concat([Buffer.from(this.prefix), chunk]);
    } else {
      result = this.prefix.toString() + (encoding === 'utf8' ? chunk : chunk.toString());
    }

    callback(null, result);
    this.hasPrefixed = true;
  }

}
