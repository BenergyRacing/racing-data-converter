import { SensorChannel } from '../enums/sensor-channel';
import { SensorUnit } from '../enums/sensor-unit';

/**
 * Represents a data variable collected
 */
export interface DataChannel<C = SensorChannel | string> {

  /**
   * The channel identification
   */
  key: C;

  /**
   * The channel name
   */
  name?: string;

  /**
   * The unit of measure
   */
  unit?: SensorUnit | string;

  /**
   * The amount of decimal places this channel supports
   */
  decimalPlaces?: number;

}
