import { DataChannel } from './data-channel';

export interface BaseWriterOptions {

  /**
   * The channels that will be fed into the writer
   */
  channels: DataChannel[];

}
