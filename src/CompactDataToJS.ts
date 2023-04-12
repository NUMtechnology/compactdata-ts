import {
  CompactData,
  CompactDataArray,
  CompactDataBoolNull,
  CompactDataFloat,
  CompactDataInteger,
  CompactDataMap,
  CompactDataPair,
  CompactDataQuoted,
  CompactDataString,
  CompactDataValue,
} from "./IntermediateParser";
import { createStringEscapeReplacer } from "./Utils";
import { parser } from "./IntermediateParser";

interface CompactDataParserInterface {
  parse(s: string): string | number | boolean | object | null;
}

class CompactDataParser implements CompactDataParserInterface {
  parse(s: string): string | number | boolean | object | null {
    const compactdata = parser(s);
    return compactdataToJS(compactdata);
  }
}

export const createCompactDataParser = (): CompactDataParser => {
  return new CompactDataParser();
};

function compactdataToJS(compactdata: CompactData): object | string | number | boolean | null {
  if (compactdata.s instanceof Array) {
    if (compactdata.s.length === 1 && compactdata.s[0] instanceof CompactDataArray) {
      return arrayToJS(compactdata.s[0]);
    } else {
      const result = {};

      compactdata.s.forEach((structure) => {
        if (structure instanceof CompactDataPair) {
          pairToJS(structure, result);
        }
        if (structure instanceof CompactDataMap) {
          mapToJS(structure, result);
        }
        if (structure instanceof CompactDataArray) {
          throw new Error("Array cannot be stored directly in a map, it must be a pair");
        }
      });

      return Object.keys(result).length === 0 ? null : result;
    }
  } else {
    return toJS(compactdata.s);
  }
}

function toJS(x: CompactDataValue): object | string | number | boolean | null {
  if (x instanceof CompactDataArray) {
    return arrayToJS(x);
  }
  if (x instanceof CompactDataMap) {
    return mapToJS(x, {});
  }
  if (x instanceof CompactDataPair) {
    return pairToJS(x, {});
  }
  if (x instanceof CompactDataQuoted) {
    return stringEscapeReplacer.replace(unquote(x.value));
  }
  if (x instanceof CompactDataInteger) {
    return x.value;
  }
  if (x instanceof CompactDataFloat) {
    return x.value;
  }
  if (x instanceof CompactDataString) {
    return stringEscapeReplacer.replace(unquote(x.value));
  }
  if (x === CompactDataBoolNull.CompactDataFalse) {
    return false;
  }
  if (x === CompactDataBoolNull.CompactDataTrue) {
    return true;
  }
  if (x === CompactDataBoolNull.CompactDataNull) {
    return null;
  }
  return x;
}

const stringEscapeReplacer = createStringEscapeReplacer();

function pairToJS(p: CompactDataPair, result: object) {
  const key = stringEscapeReplacer.replace(p.key instanceof CompactDataQuoted ? unquote(p.key.value) : unquote(p.key));
  result[key] = toJS(p.value);
  return result;
}

function mapToJS(m: CompactDataMap, result: object): object {
  m.items.forEach((i) => {
    pairToJS(i, result);
  });
  return result;
}

function arrayToJS(a: CompactDataArray): object {
  const result: Array<string | number | boolean | object | null> = [];
  a.items.forEach((x) => result.push(toJS(x)));
  return result;
}

function unquote(s: string): string {
  return (s.startsWith("`") && s.endsWith("`")) || (s.startsWith('"') && s.endsWith('"'))
    ? s.substring(1, s.length - 1)
    : s;
}
