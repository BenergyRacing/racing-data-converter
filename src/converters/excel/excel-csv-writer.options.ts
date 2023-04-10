import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface ExcelCsvWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  /**
   * The CSV column delimiter
   *
   * Defaults to a tab (\t)
   */
  delimiter?: string;

  /**
   * The CSV line delimiter
   *
   * Defaults to a CRLF (\r\n)
   */
  recordDelimiter?: string;

}
