import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface MotecCsvWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  workbook?: string;
  venue?: string;
  worksheet?: string;
  vehicle?: string;
  vehicleDescription?: string;
  driver?: string;
  engineId?: string;
  device?: string;
  comment?: string;
  session?: string;
  logDate?: Date;

  /**
   * The origin time in seconds
   */
  originTime?: number;

  /**
   * The start time in seconds
   */
  startTime?: number;

  /**
   * The end time in seconds
   */
  endTime?: number;

  /**
   * The duration in seconds
   */
  duration?: number;

  /**
   * The start distance in meters
   */
  startDistance?: number;

  /**
   * The end distance in meters
   */
  endDistance?: number;

  range?: string;

}
