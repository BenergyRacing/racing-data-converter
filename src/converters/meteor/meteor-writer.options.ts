import { MeteorSpecification } from './spec/meteor-specification';

export interface MeteorWriterOptions {
  /**
   * The data specification
   */
  spec: MeteorSpecification;

  /**
   * The log name
   */
  name?: string;

  /**
   * The log date and time
   */
  date?: Date;
}
