import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface RacePakWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

}
