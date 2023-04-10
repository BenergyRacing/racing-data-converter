import { SensorChannel } from '../enums/sensor-channel';

/**
 * Represents a collected channel value
 */
export interface DataFrame<C = SensorChannel | string> {

  /**
   * The timestamp the data frame was collected in milliseconds
   */
  timestamp: number;

  /**
   * The channel that represents what is data is.
   */
  channel: C;

  /**
   * The value for this channel in this timestamp.
   */
  value: number;

}
