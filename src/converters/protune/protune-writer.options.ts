import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface ProtuneWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  /**
   * Protune Serial Number
   */
  serialNumber?: string;

  /**
   * Description of the log file
   */
  mainComment?: string;

  /**
   * The Pro Tune firmware version (e.g. "FW:05912")
   */
  dashVersion?: string;

  /**
   * The amount of lines the final file will have
   */
  numberOfShows?: number;

  /**
   * The name of the track
   */
  trackLabel?: string;

  /**
   * Top speed in km/h
   */
  maxSpeed?: number;

  /**
   * The number of the fastest lap
   */
  bestLap?: number;

  /**
   * The total amount of laps
   */
  numberOfLaps?: number;

  logId?: string;
  filterChannel?: string;
  dashTriggerPoint?: string;
  dashReferencePoints?: string;
}
