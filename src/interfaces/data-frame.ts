import { DataChannel } from './data-channel';
import { SensorChannel } from '../enums/sensor-channel';

export interface DataFrame<C = SensorChannel | string> {

  timestamp: number;

  channel: C;

  value: number;

}
