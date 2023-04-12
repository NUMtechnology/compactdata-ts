export interface StringEscapeReplacer {
  replace(stringToTransform: string): string;
}

export const createStringEscapeReplacer = (): StringEscapeReplacer => {
  return new StringEscapeReplacerImpl();
};

class StringEscapeReplacerImpl implements StringEscapeReplacer {
  public replace(stringToTransform: string): string {
    let result = convertUnicodeSequences(stringToTransform);

    for (let i = 0; i < result.length; i++) {
      for (const entry of replacements.entries()) {
        const k = entry[0];
        const v = entry[1];
        if (result.startsWith(k, i)) {
          result = result.substring(0, i) + v + result.substring(i + k.length);
          break;
        }
      }
    }
    return result;
  }
}

const replacements: Map<string, string> = new Map([
  ["\\t", "\t"],
  ["\\n", "\n"],
  ["\\b", "\b"],
  ["\\f", "\f"],
  ["\\r", "\r"],
  ["~t", "\t"],
  ["~n", "\n"],
  ["~b", "\b"],
  ["~f", "\f"],
  ["~r", "\r"],
  ["~\\", "\\"],
  ["\\\\", "\\"],
  ["~~", "~"],
  ["\\~", "~"],
  ["~(", "("],
  ["\\(", "("],
  ["~)", ")"],
  ["\\)", ")"],
  ["~[", "["],
  ["\\[", "["],
  ["~]", "]"],
  ["\\]", "]"],
  ["~;", ";"],
  ["\\;", ";"],
  ["~`", "`"],
  ["\\`", "`"],
  ['~"', '"'],
  ['\\"', '"'],
  ["~=", "="],
  ["\\=", "="],
  ["~}", "}"],
  ["\\}", "}"],
]);

const BACKSLASH = "\\";

const HEX = 16;

const UNICODE_SEQ_LEN = 6;

const convertUnicodeSequences = (str: string): string => {
  let m;
  let start = 0;
  let result = "";
  const reg = /[~\\]u[0-9a-fA-F]{4}/g;
  do {
    m = reg.exec(str);
    if (m) {
      if (m.index > 0 && (str.charAt(m.index - 1) === "\\" || str.charAt(m.index - 1) === "~")) {
        // Its escaped so copy over as-is, without the leading slash
        if (start < m.index - 1) {
          // Copy up to the slash
          result += str.substring(start, m.index - 1);
        }
        // Copy from after the slash
        result += str.substring(m.index, (m.index as number) + UNICODE_SEQ_LEN);

        // Point to the next character after the current escape sequence
        start = (m.index as number) + UNICODE_SEQ_LEN;
      } else {
        if (start < m.index) {
          // Copy up to the current escape sequence
          result += str.substring(start, m.index);
        }

        // Append the converted character
        const c = Number.parseInt(m[0].substr(2), HEX);
        result += String.fromCharCode(c);

        // Point to the next character after the current escape sequence
        start = (m.index as number) + UNICODE_SEQ_LEN;
      }
    } else {
      result += str.substring(start);
    }
  } while (m);

  return result;
};
