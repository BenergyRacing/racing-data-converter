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

  /**
   * Converts a column value into a number.
   *
   * Defaults to the default number casting
   *
   * @param value The column value
   * @param column The column name
   */
  cast?: (value: number, column: string) => string;

  /**
   * The redix point format that will be used as the decimal separator.
   * This changes both the thousants and decimal separators.
   *
   * This property is ignored when `cast` is defined.
   *
   * Defaults to "period".
   */
  castFractionPoint?: 'period' | 'comma';
}
