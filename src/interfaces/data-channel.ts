import { SensorChannel } from '../enums/sensor-channel';
import { SensorUnit } from '../enums/sensor-unit';

export interface DataChannel<C = SensorChannel | string> {

  key: C;

  name?: string;

  unit?: SensorUnit | string;

  decimalPlaces?: number;

}
