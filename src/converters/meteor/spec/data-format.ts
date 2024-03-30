/**
 * Represents a meteor data format
 */
export enum DataFormatType {
  /**
   * Integers. Only positive numbers.
   */
  UnsignedNumber = 'unsigned-number',

  /**
   * Integers. Both negative and positive.
   */
  SignedNumber = 'signed-number',
}

/**
 * Represents the specification for an integer number
 */
export interface DataFormat {
  type: DataFormatType.UnsignedNumber | DataFormatType.SignedNumber;

  // ((base unit + addition) / divisor * multiplier) = unit

  /**
   * The number that must be added in order to convert from binary
   */
  addition?: number;

  /**
   * The number that must be multiplied in order to convert from binary
   */
  multiplier?: number;

  /**
   * The number that must be divided in order to convert from binary
   */
  divisor?: number;
}
