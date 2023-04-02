import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface ProtuneWriterOptions extends BaseWriterOptions {

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  /**
   * Protune Serial Number
   */
  serialNumber?: string;

}
