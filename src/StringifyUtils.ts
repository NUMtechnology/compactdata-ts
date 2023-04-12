import { createUnicodeEscaper } from "./UnicodeEscaper";
/**
 * Escape graves.
 */
export const escapeGraves = (s: string | null) => (s !== null ? s.replace(/`/g, "~`") : s);

export const shouldBeGraveQuoted = new RegExp(".*[()\\[\\];{}=].*");
export const isNumeric = new RegExp("^[-]?[0-9]*\\.?[0-9]+(?:[Ee][+-]?[0-9]+)?$");

export const escapeDoubleQuotes = (s: string) => {
  let i = s.indexOf('"', 1);
  let result = s;
  while (i > 0 && i < s.length - 1) {
    result = result.substring(0, i) + "~u0022" + result.substring(i + 1);
    i = result.indexOf('"', 1);
  }
  return result;
};

/**
 * Some CompactData string need backtick quotes.
 */
export const graveQuoteIfNecessary = (s: string | null) => {
  if (
    s !== null &&
    (shouldBeGraveQuoted.test(s) ||
      s === "" ||
      (isNumeric.test(s) && s !== "00" && s !== "01" && s !== "000") ||
      "true" === s ||
      "false" === s ||
      "null" === s ||
      isAllSpaces(s))
  ) {
    return "`" + s + "`";
  } else {
    return s;
  }
};

/**
 *
 * @param s string
 * @returns true if the string is all spaces
 */
const isAllSpaces = (s: string): boolean => {
  return s.trim().length === 0;
};
/**
 * Some CompactData string need backtick quotes.
 */
export const doubleQuoteIfNecessary = (s: string | null) => (s !== null && s.includes("~`") ? '"' + s + '"' : s);

/**
 * Replace double-quoted strings with graved strings if possible
 */
export const doubleQuotesToGravesIfPossible = (s: string | null) =>
  s !== null && !s.includes("~`") && s.startsWith('"') && s.endsWith('"')
    ? "`" + s.substring(1, s.length - 1) + "`"
    : s;

/**
 * Replace NBSP with SP
 */
export const replaceNbspWithSp = (s: string) => s.replace(/\u00a0/g, " ");

const unicodeEscaper = createUnicodeEscaper();

/**
 * Handy function composition
 */
export const escapeAndQuote = (s: string | null): string | null => {
  if (s === null) {
    return s;
  }
  return doubleQuotesToGravesIfPossible(
    doubleQuoteIfNecessary(
      graveQuoteIfNecessary(escapeGraves(escapeDoubleQuotes(unicodeEscaper.escape(replaceNbspWithSp(s)))))
    )
  );
};

/**
 * Check whether a value is a non-string primitive.
 *
 * @param escapedKey
 * @return true or false
 */
export const isNonStringPrimitive = (s: string): boolean => {
  // Is it true, false, null, or numeric?
  return primitives.includes(s) || isNumeric.test(s);
};

const primitives = ["true", "false", "null"];
