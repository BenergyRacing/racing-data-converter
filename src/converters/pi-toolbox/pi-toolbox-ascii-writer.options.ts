import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface PiToolboxAsciiWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  carName?: string;
  driverName?: string;
  engineTest?: boolean;
  firstLapNumber?: number;
  longComment?: string;
  outingNumber?: number;
  sessionNumber?: number;
  shortComment?: string;
  trackName?: string;

}
