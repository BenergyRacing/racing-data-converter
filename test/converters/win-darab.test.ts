import { WinDarabWriter } from '../../src/converters/win-darab';
import {
  formatWinDarabColumnName,
  formatWinDarabCsvItem,
  formatWinDarabNumber,
  formatWinDarabString
} from '../../src/converters/win-darab/utils';
import { getWriterOutput } from '../data/utils';
import { frames1 } from '../data/frames1';

const frames1Result = `# BOSCH-DARAB extract file created 01.01.2023 00:00:00
#
#
xtime       [s]\tChannel 1      \tChannel 2   [m]\t"Channel ""3""    "
           0.00\t             10\t               \t               
           0.01\t             30\t             20\t               
           0.04\t             40\t             20\t           0.14
`;

test('windarab conversion', async () => {
  const writer = new WinDarabWriter({
    channels: frames1.channels,
    createDate: new Date(2023, 0, 1, 0, 0, 0),
  });

  const result = await getWriterOutput(writer, frames1.frames);

  expect(result).toBe(frames1Result);
});

test('windarab csv item formatting', () => {
  expect(formatWinDarabCsvItem('test')).toBe('           test');
});

test('windarab csv column formatting', () => {
  expect(formatWinDarabColumnName('test', 'm')).toBe('test        [m]');
  expect(formatWinDarabColumnName('test', undefined)).toBe('test           ');
});

test('windarab string formatting', () => {
  expect(formatWinDarabString('test\n\ttest')).toBe('testtest');
});

test('windarab number formatting', () => {
  expect(formatWinDarabNumber(10.5125, 2)).toBe('10.51');
  expect(formatWinDarabNumber(10.5, 2)).toBe('10.50');
  expect(formatWinDarabNumber(10.5, 0)).toBe('10.5');
  expect(formatWinDarabNumber(10, 0)).toBe('10');
});
