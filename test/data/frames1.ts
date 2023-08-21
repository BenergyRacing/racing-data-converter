
export const frames1 = {
  channels: [
    { key: "ch1", name: "Channel 1" },
    { key: "ch2", name: "Channel 2", unit: "m" },
    { key: "ch3", name: "Channel \"3\"", decimalPlaces: 2 }
  ],
  frames: [
    { channel: "ch1", timestamp: 0, value: 10 },
    { channel: "ch2", timestamp: 10, value: 20 },
    { channel: "ch1", timestamp: 10, value: 30 },
    { channel: "ch1", timestamp: 40, value: 40 },
    { channel: "ch3", timestamp: 40, value: 0.142 }
  ]
};
