export class CompactData {
  constructor(readonly s: CompactDataStructure[] | CompactDataPrimitive) {}
}

export type CompactDataStructure = CompactDataMap | CompactDataArray | CompactDataPair;

export class CompactDataMap {
  constructor(readonly items: CompactDataMapItem[]) {}
}

export class CompactDataArray {
  constructor(readonly items: CompactDataValue[]) {}
}

export class CompactDataPair {
  constructor(
    readonly key: string | CompactDataQuoted,
    readonly value: CompactDataPrimitive | CompactDataMap | CompactDataArray
  ) {}
}

export type CompactDataMapItem = CompactDataPair;

export type CompactDataValue = CompactDataMap | CompactDataPair | CompactDataArray | CompactDataPrimitive;

export type CompactDataPrimitive =
  | CompactDataQuoted
  | CompactDataInteger
  | CompactDataFloat
  | CompactDataString
  | CompactDataBoolNull;

export class CompactDataInteger {
  constructor(readonly value: number) {}
}

export class CompactDataFloat {
  constructor(readonly value: number) {}
}

export class CompactDataQuoted {
  constructor(readonly value: string) {}
}

export class CompactDataString {
  constructor(readonly value: string) {}
}

export enum CompactDataBoolNull {
  CompactDataTrue,
  CompactDataFalse,
  CompactDataNull,
}
