import { createCompactDataParser } from "./CompactDataToJS";

import { createJSToCompactData } from "./JSToCompactData";

const parser = createCompactDataParser();
/**
 * Converts a CompactData string to JavaScript object
 * @param s The CompactData string to parse
 * @returns A JavaScript object
 */
export const parse = function (s: string): string | number | boolean | object | null {
  return parser.parse(s);
};

const jsToCompactData = createJSToCompactData();

/**
 * Converts a JavaScript object to a CompactData string
 * @param obj The object to convert
 * @returns A CompactData string
 */
export const stringify = function (obj: object): string | null {
  return jsToCompactData.objectToCompactData(obj);
};

export default {
  parse,
  stringify,
};
