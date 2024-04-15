import { DataChannel } from '../../interfaces/data-channel';
import { DataFrame } from '../../interfaces/data-frame';

export interface JsonFormat {

  /**
   * The channels that are stored for keeping the context
   */
  channels: DataChannel[];

  /**
   * The full list of data frames
   */
  frames: DataFrame[];

}
