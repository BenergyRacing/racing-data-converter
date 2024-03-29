# Racing Data Converter

Converts time series data into popular motorsport Data Logger formats.

This library was developed at [B'Energy Racing](https://benergyracing.com.br), a Formula SAE Electric Team from the [Facens University Center](https://facens.br).

## Outputs supported

| Format            | Extension  | Software            |
|-------------------|------------|---------------------|
| Pro Tune          | .dlf       | Pro Tune Analyzer   |
| MegaSquirt ASCII  | .msl       | MegaLogViewer       |
| MoTeC CSV         | .csv       | MoTeC i2            |
| Pi ASCII          | .txt       | Cosworth Pi Toolbox |
| BOSCH Darab ASCII | .txt       | Bosch WinDarab      |
| RacePak ASCII     | .txt       | RacePak DataLink II |
| Excel CSV         | .csv       | Microsoft Excel     |
| CSV               | .csv, .tsv | -                   |

## Command Line Interface

The CLI allows converting without writing a single line of code.

By default, it reads CSV files and outputs any format. The CSV file must have the first column as the timestamp in seconds. Columns can follow the format `Name (unit)` or `Name (unit) [key]`.

Type `racing-data-converter --help` for a list of options.

### Example
```sh
racing-data-converter ./input.csv ./output.dlf --output-format protune
```

## Application Programming Interface

1. Create an input stream. This can be a simple passthrough stream such as `DataFrameStream` or read from a `CsvReader`.
2. Define the list of channels that you will work with, including information such as the unit of measure.
3. Create a writer. This can be a `CsvWriter`, `ExcelCsvWriter`, `MegaSquirtWriter`, `MotecCsvWriter`, `PiToolboxAsciiWriter`, `ProtuneWriter`, `RacePakWriter`, `WinDarabWriter`.
4. Create a writer stream from the writer class, receiving the input stream created earlier.
5. The file is successfuly converted!

### Sample

```ts
// Creates a plain data frame stream. This will be the input
const dataFrameStream = new DataFrameStream();

// Creates a Protune writer with two channels
const writer = new ProtuneWriter({
  channels: [
    {
      key: SensorChannel.GPS_SPEED,
      name: 'Speed',
      unit: 'Km/h',
    },
    {
      key: 'happy-sensor',
      name: 'Happy Sensor',
      unit: 'm',
      decimalPlaces: 2,
    }
  ]
});

// Creates a Protune stream using the data frame stream as the input
const protuneStream = writer.createStream(dataFrameStream);

// Pipes the Protune stream into the output file
protuneStream.pipe(fs.createWriteStream('sample-output.dlf'));

// Writes a few data frames
dataFrameStream.write({
  channel: SensorChannel.GPS_SPEED,
  value: 53,
  timestamp: 10,
});

dataFrameStream.write({
  channel: 'happy-sensor',
  value: 3925,
  timestamp: 15,
});

dataFrameStream.write({
  channel: SensorChannel.GPS_SPEED,
  value: 59,
  timestamp: 20,
});

// Finishes writing
dataFrameStream.end();
```

There are more [samples available](https://github.com/BenergyRacing/racing-data-converter/tree/main/test/samples).
