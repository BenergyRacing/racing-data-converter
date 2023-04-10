import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface WinDarabWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   *
   * Defaults to 10ms
   */
  interval?: number;

  /**
   * The log creation date.
   *
   * Defaults to now.
   */
  createDate?: Date;

  /**
   * The source file path
   */
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
