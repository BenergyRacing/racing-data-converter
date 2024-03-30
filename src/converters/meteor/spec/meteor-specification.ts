import { TopicMetadata } from './topic-metadata';
import { CompositeTopicMetadata } from './composite-topic-metadata';

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
