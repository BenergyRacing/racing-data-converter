import { DataFormat } from './data-format';
import { DataChannel } from '../../../interfaces/data-channel';

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

