import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface CsvWriterOptions extends BaseWriterOptions {

  /**
   * The CSV column delimiter
   */
  delimiter?: string;

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  /**
   * Quote all non-empty values
   */
  quoted?: boolean;

  /**
   * Quote all empty values
   */
  quotedEmpty?: boolean;

}
