import { SensorChannel } from '../../enums/sensor-channel';

export const proTuneChannels: Partial<Record<SensorChannel, string>> = {
  [SensorChannel.ACCELERATION_X]: 'Accel Lateral X',
  [SensorChannel.ACCELERATION_Y]: 'Accel Longitudinal Y',
  [SensorChannel.ACCELERATION_Z]: 'Accel Vertical Z',
  [SensorChannel.LAP_NUMBER]: 'Lap Number',
  [SensorChannel.LAP_TIME]: 'Lap Time',
  [SensorChannel.GPS_ALTITUDE]: 'GPS Altitude',
  [SensorChannel.GPS_DISTANCE]: 'GPS Distance',
  [SensorChannel.GPS_LATITUDE]: 'GPS Latitude',
  [SensorChannel.GPS_LONGITUDE]: 'GPS Longitude',
  [SensorChannel.GPS_SATELLITES]: 'GPS Sats Used',
  [SensorChannel.GPS_SPEED]: 'GPS Speed',
  [SensorChannel.THROTTLE_POSITION]: 'Throttle position',
};
