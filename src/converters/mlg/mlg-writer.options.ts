import { BaseWriterOptions } from '../../interfaces/base-writer.options';
import { DataChannel } from '../../interfaces/data-channel';

export interface MlgWriterOptions extends BaseWriterOptions {

  /**
   * The channels that will be fed into the writer
   */
  channels: MlgDataChannel[];

  /**
   * The interval in milliseconds in which each block will be spaced
   */
  interval?: number;

  /**
   * The timestamp of the log file
   */
  date?: Date;

  /**
   * Information data
   */
  description?: string;

}

export enum MlgType {
  /**
   * Unsigned 8-bit integer
   */
  U08 = 'U08',

  /**
   * Signed 8-bit integer
   */
  S08 = 'S08',

  /**
   * Unsigned 16-bit integer
   */
  U16 = 'U16',

  /**
   * Signed 16-bit integer
   */
  S16 = 'S16',

  /**
   * Unsigned 32-bit integer
   */
  U32 = 'U32',

  /**
   * Signed 32-bit integer
   */
  S32 = 'S32',

  /**
   * Signed 64-bit integer
   */
  S64 = 'S64',

  /**
   * Signed 32-bit floating point
   */
  F32 = 'F32',
}

export interface MlgDataChannel extends DataChannel {
  /**
   * The MLVLG value format.
   *
   * Defaults to F32
   */
  mlgType?: MlgType;

  /**
   * The number to add to the raw value.
   *
   * Formula: `(raw + transform) * scale`.
   * Defaults to 0
   */
  transform?: number;

  /**
   * The number to multiply to the raw value.
   *
   * Formula: `(raw + transform) * scale`.
   * Defaults to 1
   */
  scale?: number;

  /**
   * The category name
   */
  category?: string;
}
