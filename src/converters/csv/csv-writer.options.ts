import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface CsvWriterOptions extends BaseWriterOptions {

  /**
   * The CSV column delimiter
   *
   * Defaults to a comma (,)
   */
  delimiter?: string;

  /**
   * The CSV line delimiter
   *
   * Defaults to a LF (\n)
   */
  recordDelimiter?: string;

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

  /**
   * The timestamp column name
   */
  timeColumn?: string;

}
