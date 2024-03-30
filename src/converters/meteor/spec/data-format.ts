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
   * The number that must be added to convert this number
   */
  addition?: number;

  /**
   * The number that must be multiplied to convert this number
   */
  multiplier?: number;

  /**
   * The number that must be divided to convert this number
   */
  divisor?: number;
}
