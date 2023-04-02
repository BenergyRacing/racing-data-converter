import { SensorChannelType } from '../enums/sensor-channel.type';
import { SensorUnitType } from '../enums/sensor-unit.type';

export interface DataChannelInterface<C = SensorChannelType | string> {

  key: C;

  name?: string;

  unit?: SensorUnitType | string;

  decimalPlaces?: number;

}
