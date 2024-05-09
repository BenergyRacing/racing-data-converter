# racing-data-converter JSON log format

The format exported/imported as "JSON" in the racing-data-converted library is a JSON object containing raw data frames as well as channel information.

The format can be expressed through the following TypeScript interfaces:

```ts
/**
 * Root object of the file format
 */
interface JsonFormat {

  /**
   * The channels that are stored for keeping the context
   */
  channels: DataChannel[];

  /**
   * The full list of data frames
   */
  frames: DataFrame[];

}

/**
 * Represents a data variable collected
 */
interface DataChannel {

  /**
   * The channel identification
   */
  key: string;

  /**
   * The channel name
   */
  name?: string;

  /**
   * The unit of measure
   */
  unit?: string;

  /**
   * The amount of decimal places this channel supports
   */
  decimalPlaces?: number;

}

/**
 * Represents a collected channel value
 */
interface DataFrame {

  /**
   * The timestamp the data frame was collected in milliseconds
   */
  timestamp: number;

  /**
   * The channel that represents what is data is.
   */
  channel: string;

  /**
   * The value for this channel in this timestamp.
   */
  value: number;

}
```

This is also the internal format used as an intermediate representation by the library to convert between different formats.

---

Here's a small sample:

```json
{
  "channels": [
    {
      "key": "acceleration",
      "name": "Acceleration",
      "unit": "km/h"
    },
    {
      "key": "test",
      "name": "Test Value"
    },
    {
      "key": "sine",
      "name": "Sine"
    }
  ],
  "frames": [
    {
      "channel": "acceleration",
      "timestamp": 0,
      "value": 0
    },
    {
      "channel": "test",
      "timestamp": 0,
      "value": 572
    },
    {
      "channel": "sine",
      "timestamp": 0,
      "value": 0
    },
    {
      "channel": "acceleration",
      "timestamp": 100,
      "value": 2
    },
    {
      "channel": "test",
      "timestamp": 100,
      "value": 871
    },
    {
      "channel": "sine",
      "timestamp": 100,
      "value": 0.06279051952931337
    },
    {
      "channel": "acceleration",
      "timestamp": 200,
      "value": 4
    },
    {
      "channel": "test",
      "timestamp": 200,
      "value": 641
    },
    {
      "channel": "sine",
      "timestamp": 200,
      "value": 0.12533323356430426
    }
  ]
}
```
