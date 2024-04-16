# racing-data-converter CSV columns format

## Header format

In order to extract channel information, racing-data-converter allows unit as well as channel identification to be defined in the header using the following format:

```
Name (unit) [key]
```

All the headers below have valid syntax:
- `Speed (Km/h) [speed]`
- `Speed (Km/h)`
- `Speed`

## Timestamp column

By default, racing-data-converter expects that the timestamp in milliseconds is the first column in the file (named `Time (ms)` by default).

The lines **must** be ordered by timestamp (lowest first).

## Column Values

Column values are expected to be numbers, using period as the decimal separator and using comma as the thousants separator.

All the numbers below have valid syntax:
- `3.14`
- `3.0000`
- `3`
- `314e-2`

Any non-numeric value will be treated as blank.

## Sample

No custom configuration needed, this example will work as-is.

```csv
Time (ms),Speed (Km/h) [speed],Brake Pressure (bar)
10,5.50,0.00
60,6.00,0.00
120,7.50,0.00
200,5.25,11.50
```

## Custom Configuration Object

The CLI allows changing the default configuration through a JSON configuration file.

### Reader Configuration Format

The expected format for the CSV reader is defined by the TypeScript interface below. Properties may be omitted in order to use the default value.

```ts
interface CsvReaderOptions {
  /**
   * The CSV column delimiter
   *
   * Defaults to a comma (,)
   */
  delimiter?: string;

  /**
   * The CSV line delimiter
   *
   * Defaults to a LF (\n)
   */
  recordDelimiter?: string;

  /**
   * The column that has the timestamp in milliseconds
   */
  timeColumn: string;

  /**
   * Column names in order of appearence.
   *
   * If not set, it will automatically treat the first line as column names
   */
  columns?: string[];

  /**
   * The column to channel mapping.
   *
   * In case a channel is undefined, the value will not be converted into a data frame
   *
   * Defaults to column names being their respective channels
   */
  columnToChannelMap?: Record<string, DataChannel | string>;
}
```

#### Sample
```json
{
  "delimiter": ",",
  "recordDelimiter": "\n",
  "timeColumn": "Timestamp",
  "columns": ["Timestamp", "Speed", "Brake Pressure"],
  "columnToChannelMap": {
    "Timestamp": {
      "key": "time",
      "name": "Timestamp",
      "unit": "ms"
    },
    "Speed": {
      "key": "speed",
      "name": "Speed",
      "unit": "Km/h"
    },
    "Brake Pressure": {
      "key": "brake-pressure",
      "name": "Brake Pressure",
      "unit": "bar"
    }
  }
}
```

### Writer Configuration Format

The expected format for the CSV writer is defined by the TypeScript interface below. Properties may be omitted in order to use the default value.

```ts
interface CsvWriterOptions {
  /**
   * The CSV column delimiter
   *
   * Defaults to a comma (,)
   */
  delimiter?: string;

  /**
   * The CSV line delimiter
   *
   * Defaults to a LF (\n)
   */
  recordDelimiter?: string;

  /**
   * The interval in milliseconds in which each row will be spaced
   */
  interval?: number;

  /**
   * Quote all non-empty values
   */
  quoted?: boolean;

  /**
   * Quote all empty values
   */
  quotedEmpty?: boolean;

  /**
   * The timestamp column name
   */
  timeColumn?: string;

  /**
   * The redix point format that will be used as the decimal separator.
   * This changes both the thousants and decimal separators.
   *
   * This property is ignored when `cast` is defined.
   *
   * Defaults to "period".
   */
  castFractionPoint?: 'period' | 'comma';
}
```

#### Sample
```json
{
  "delimiter": ",",
  "recordDelimiter": "\n",
  "interval": 10,
  "quoted": false,
  "quotedEmpty": true,
  "timeColumn": "Timestamp",
  "castFractionPoint": "comma"
}
```
