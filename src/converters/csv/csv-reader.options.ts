import { DataChannel } from '../../interfaces/data-channel';
import { SensorChannel } from '../../enums/sensor-channel';

export interface CsvReaderOptions {

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
   * The column that has the timestamp in milliseconds
   */
  timeColumn: string | ((columns: string[]) => string);

  /**
   * Converts a column value into a number.
   *
   * Defaults to the default number casting
   *
   * @param value The column value
   * @param column The column name
   */
  cast?: (value: string, column: string) => number | undefined;

  /**
   * Column names in order of appearence.
   *
   * If not set, it will automatically treat the first line as column names
   */
  columns?: string[];

  /**
   * The column to channel mapping.
   *
   * In case a channel is undefined, the value will not be converted into a data frame
   *
   * Defaults to column names being their respective channels
   */
  columnToChannelMap?: Record<string, DataChannel | SensorChannel | string> | ((column: string) => DataChannel | SensorChannel | string | undefined);

}
