import { BaseWriterOptions } from '../../interfaces/base-writer.options';

export interface JsonWriterOptions extends BaseWriterOptions {

  /**
   * The amount of spaces for the indentation.
   *
   * When set to `undefined`, no indentation is applied and the resulting JSON will be a one-liner.
   */
  indent?: number;

}
