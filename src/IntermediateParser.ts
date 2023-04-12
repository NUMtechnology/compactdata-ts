import {
  CompactData,
  CompactDataArray,
  CompactDataBoolNull,
  CompactDataFloat,
  CompactDataInteger,
  CompactDataMap,
  CompactDataPair,
  CompactDataPrimitive,
  CompactDataQuoted,
  CompactDataString,
  CompactDataStructure,
  CompactDataValue,
} from "./Model";
import { parseCompactData, ParserException } from "./CompactDataParser";
import { TokeniserException } from "./CompactDataTokeniser";

export {
  CompactData,
  CompactDataMap,
  CompactDataArray,
  CompactDataPair,
  CompactDataStructure,
  CompactDataQuoted,
  CompactDataInteger,
  CompactDataFloat,
  CompactDataString,
  CompactDataBoolNull,
  CompactDataPrimitive,
  CompactDataValue,
};
export { ParserException, TokeniserException };
export const parser = parseCompactData;
