# B'Energy Meteor Log Format

Meteor is a file format used by the data logger for the B'Energy project.

The format is purely based on binary data frames, trying to be as compact as possible, maximizing throughput in a low-end microcontroller.

The first version was developed in 2020, the second one was developed in 2023 and open-sourced in 2024.
The format was developed by [Guilherme Chaguri](https://github.com/Guichaguri) for [B'Energy Racing](https://benergyracing.com.br).

## Meteor File Format

### Why

There are many file formats out there. Some are simple and straightforward, such as CSV, and others are optimized but complex, such as Pickle.

At B'Energy, we needed a writer written in plain C, that runs in a microcontroller and stores its data in a SD Card connected through SPI. And because of that, there were some concerns:
- **Simple logic**: as it needed to be written in plain C, we wanted a straightforward solution.
- **Static memory allocation**: as it ran on a microcontroller, dynamic memory allocation is not an easily available resource.
- **Small memory footprint**: as the microcontroller RAM and flash is low, we wanted a very small memory usage.
- **Compact data frames**: as the microcontroller CPU speed and transfer rate were low, we wanted small data frames to allow maximum I/O throughput.

We could have implemented CSV with a pretty simple logic, only using static memory allocation and have overall a small memory footprint. But each data frame consists in a whole line, which requires all columns to be written at once, resulting in a low throughput.

As real data may have distinct acquisition frequencies, the format allows high frequency data to be written in high frequencies, and low frequency data to be written in low frequency.
For instance, a temperature topic will only be written once every 10 seconds, but the motor torque will be written every 100 milliseconds.

That is something that formats like CSV fail upon, as all data need to be written at the same frequency, resulting in a lower throughput and bigger files.

Low throughput implies that fewer data frames can be written every second, which means the frequency of data being written will be low.

### How

The format has two main sections:
- The header, which contains the file signature and the general information
- The data, which contains data frames written sequentially

The data frame structure consists as follows:
- Timestamp (in milliseconds, since the log has started)
- Frame Type (single topic or composite)
- Topic/Composite ID
- Data (variable length)

A topic is a description of a single scalar value.
A composite is a collection of multiple topics all written at once.

A data frame containing a composite can contain as many as 255 topics in a single data frame.

![Meteor File Format](./Meteor-File-Format.svg)

The format fills its objectives as each topic can be written in distinct frequencies, related topics can be written in a single data frame (through composites) and the format is optimized in size as well as being relatively simple to implement a writer.

## Meteor Data Specification

Alongside the log file, you must have a JSON file containing the data specification, a file that describes what topics and composites IDs represent and how to convert those bytes into actual values.

The meteor data specification follows [this TypeScript interface](https://github.com/BenergyRacing/racing-data-converter/blob/main/src/converters/meteor/spec/meteor-data-specification.ts). The specification can then be wrapped in a configuration file, and passed to the CLI.

### Sample

meteor-options.json
```json
{
  "spec": {
    "topics": [
      {
        "id": 1,
        "key": "throttle-position",
        "name": "APPS",
        "data": {
          "type": "unsigned-number",
          "divisor": 4095
        },
        "unit": "%"
      },
      {
        "id": 2,
        "key": "bpps",
        "name": "Main Brake Pressure Sensor",
        "data": {
          "type": "unsigned-number",
          "divisor": 41
        },
        "unit": "bar"
      },
      {
        "id": 3,
        "key": "motor-temperature",
        "name": "Motor Temperature",
        "data": {
          "type": "signed-number",
          "divisor": 11329,
          "addition": -17151,
          "multiplier": 125
        },
        "unit": "ºC"
      },
      {
        "id": 4,
        "key": "battery-min-cell-voltage",
        "name": "Battery Minimum Cell Voltage",
        "data": {
          "type": "unsigned-number",
          "divisor": 100,
          "addition": 2
        },
        "unit": "V"
      }
    ],
    "composites": [
      {
        "id": 1,
        "topics": [
          {
            "key": "throttle-position",
            "length": 4
          },
          {
            "key": "bpps",
            "length": 4
          }
        ]
      }
    ]
  }
}
```

### Usage

Pass the file path to `--input-options-file` or `--output-options-file`:

```sh
racing-data-converter ./input.met ./output.csv --input-options-file ./meteor-options.json
```

```sh
racing-data-converter ./input.csv ./output.met --output-options-file ./meteor-options.json
```
