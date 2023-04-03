import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface WinDarabWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  createDate?: Date;
  sourceFilePath?: string;

  /**
   * Start time in milliseconds
   */
  startTime?: number;

  /**
   * End time in milliseconds
   */
  endTime?: number;

}
