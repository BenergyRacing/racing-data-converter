import { MeteorDataSpecification } from './spec/meteor-data-specification';

export interface MeteorWriterOptions {
  /**
   * The data specification
   */
  spec: MeteorDataSpecification;

  /**
   * The log name. Defaults to "LOG".
   *
   * Note: The name may have up to 255 bytes, otherwise it will be capped.
   */
  name?: string;

  /**
   * The log date and time
   */
  date?: Date;
}
