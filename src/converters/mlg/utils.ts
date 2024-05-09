import { MlvlgType } from './mlg-writer.options';

export const mlvlgTypeId: Record<MlvlgType, number> = {
  [MlvlgType.U08]: 0,
  [MlvlgType.S08]: 1,
  [MlvlgType.U16]: 2,
  [MlvlgType.S16]: 3,
  [MlvlgType.U32]: 4,
  [MlvlgType.S32]: 5,
  [MlvlgType.S64]: 6,
  [MlvlgType.F32]: 7,
}

export const mlvlgTypeByteSize: Record<MlvlgType, number> = {
  [MlvlgType.U08]: 1,
  [MlvlgType.S08]: 1,
  [MlvlgType.U16]: 2,
  [MlvlgType.S16]: 2,
  [MlvlgType.U32]: 4,
  [MlvlgType.S32]: 4,
  [MlvlgType.S64]: 8,
  [MlvlgType.F32]: 4,
};
