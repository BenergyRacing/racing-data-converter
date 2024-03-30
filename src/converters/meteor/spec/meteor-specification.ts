import { DataFormat } from './data-format';
import { DataChannel } from '../../../interfaces/data-channel';
import { SensorChannel } from '../../../enums/sensor-channel';

/**
 * Represents an B'Energy Meteor Log specification
 */
export interface MeteorSpecification {
  /**
   * The list of supported topics
   */
  topics: TopicMetadata[];

  /**
   * The list of supported composites
   */
  composites: CompositeTopicMetadata[];
}

export interface TopicMetadata extends DataChannel {
  /**
   * The unique topic identifier. Must be a number from 0 to 255.
   */
  id: number;

  /**
   * The format data is stored in this topic
   */
  data: DataFormat;
}

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
