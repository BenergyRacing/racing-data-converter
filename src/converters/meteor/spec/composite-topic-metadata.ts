import { SensorChannel } from '../../../enums/sensor-channel';

export interface CompositeTopicMetadata {
  /**
   * The unique composite identifier. Must be a number from 0 to 255.
   */
  id: number;

  /**
   * The list of topics contained in this composite
   */
  topics: CompositeTopicItem[];
}

export interface CompositeTopicItem<C = SensorChannel | string> {
  /**
   * The channel identifier. A topic with this identifier must exist within the topic list
   */
  key: C;

  /**
   * The data length in bytes
   */
  length: number;
}
