import { MlgType } from './mlg-writer.options';

export const mlvlgTypeId: Record<MlgType, number> = {
  [MlgType.U08]: 0,
  [MlgType.S08]: 1,
  [MlgType.U16]: 2,
  [MlgType.S16]: 3,
  [MlgType.U32]: 4,
  [MlgType.S32]: 5,
  [MlgType.S64]: 6,
  [MlgType.F32]: 7,
}

export const mlvlgTypeByteSize: Record<MlgType, number> = {
  [MlgType.U08]: 1,
  [MlgType.S08]: 1,
  [MlgType.U16]: 2,
  [MlgType.S16]: 2,
  [MlgType.U32]: 4,
  [MlgType.S32]: 4,
  [MlgType.S64]: 8,
  [MlgType.F32]: 4,
};
