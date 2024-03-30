import { DataChannel, DataFormatType, DataFrame, MeteorDataSpecification } from '../../src';

export const frames1 = {
  channels: [
    { key: "ch1", name: "Channel 1" },
    { key: "ch2", name: "Channel 2", unit: "m" },
    { key: "ch3", name: "Channel \"3\"", decimalPlaces: 2 }
  ] as DataChannel[],
  frames: [
    { channel: "ch1", timestamp: 0, value: 10 },
    { channel: "ch2", timestamp: 10, value: 20 },
    { channel: "ch1", timestamp: 10, value: 30 },
    { channel: "ch1", timestamp: 40, value: 40 },
    { channel: "ch3", timestamp: 40, value: 0.142 }
  ] as DataFrame[],
  meteorSpec: {
    topics: [
      { key: "ch1", id: 1, data: { type: DataFormatType.UnsignedNumber } },
      { key: "ch2", id: 2, data: { type: DataFormatType.SignedNumber } },
      { key: "ch3", id: 3, data: { type: DataFormatType.UnsignedNumber, divisor: 1000 } },
    ],
    composites: [],
  } as MeteorDataSpecification,
};
