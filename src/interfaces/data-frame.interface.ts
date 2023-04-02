import { DataChannelInterface } from './data-channel.interface';
import { SensorChannelType } from '../enums/sensor-channel.type';

export interface DataFrameInterface<C = SensorChannelType | string> {

  timestamp: number;

  channel: C;

  value: number;

}
