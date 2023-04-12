export interface UnicodeEscaper {
  escape(s: string): string;
}

export const createUnicodeEscaper = (): UnicodeEscaper => {
  return new UnicodeEscaperImpl();
};

class UnicodeEscaperImpl implements UnicodeEscaper {
  escape(s: string): string {
    let result = "";
    const str = s.replace(/~u/g, "~~u");
    for (let i = 0; i < str.length; i++) {
      const cp = str.charCodeAt(i);
      result += escapeChar(cp);
    }
    return result;
  }
}

const VERTICAL_TAB = 0x0b;
const BACKSPACE = 0x08;
const FORMFEED = 0x0c;
const LINEFEED = 0x0a;
const CARRIAGE_RETURN = 0x0d;
const TAB = 0x09;

function escapeChar(c: number | undefined) {
  if (!c) {
    return "";
  }

  if (c >= 32 && c <= 127) {
    return String.fromCodePoint(c);
  } else if (c === VERTICAL_TAB) {
    return "~u000B";
  } else if (c === BACKSPACE) {
    return "\\b";
  } else if (c === FORMFEED) {
    return "\\f";
  } else if (c === LINEFEED) {
    return "\\n";
  } else if (c === CARRIAGE_RETURN) {
    return "\\r";
  } else if (c === TAB) {
    return "\\t";
  } else {
    return String.fromCodePoint(c);
  }
}
