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
import { Token, tokeniser, TokenType } from "./CompactDataTokeniser";
import { TokenStream } from "./TokenStream";

//------------------------------------------------------------------------------------------------------------------------
// Exports
//------------------------------------------------------------------------------------------------------------------------

/**
 * Parse a CompactData string into a CompactData object.
 *
 * @param s a CompactData string
 * @returns a CompactData object
 */
export const parseCompactData = (s: string): CompactData => {
  const tokens = tokeniser(s);

  const rootItems: CompactDataStructure[] | CompactDataPrimitive = parse(new TokenStream(tokens));

  return new CompactData(rootItems);
};

/**
 * Parsing errors
 */
export class ParserException extends Error {}

//------------------------------------------------------------------------------------------------------------------------
// Internals
//------------------------------------------------------------------------------------------------------------------------

/**
 * Parse a CompactData TokenStream to a CompactDataStructure array or a CompactDataPrimitive
 *
 * @param s a TokenStream
 * @returns a CompactDataStructure array or a CompactDataPrimitive
 */
const parse = (s: TokenStream): CompactDataStructure[] | CompactDataPrimitive => {
  const rootPrimitive: CompactDataPrimitive | null = parsePrimitive(s);
  if (rootPrimitive !== null) {
    return rootPrimitive;
  }
  return parseStructures(s);
};

/**
 * Try to parse a CompactDataPrimitive from a TokenStream.
 *
 * @param s a TokenStream
 * @returns a CompactDataPrimitive or null
 */
const parsePrimitive = (s: TokenStream): CompactDataPrimitive | null => {
  let result: CompactDataPrimitive | null = null;
  const tok = s.next() as Token;
  switch (tok.type) {
    case TokenType.LPAREN:
    case TokenType.RPAREN:
    case TokenType.LBRACKET:
    case TokenType.RBRACKET:
    case TokenType.EQUALS: {
      if (s.empty()) {
        throw new ParserException(`Unexpected token: ${tok.toS()}`);
      }
      s.pushBack(tok);
      return null;
    }
    case TokenType.NULL: {
      result = CompactDataBoolNull.CompactDataNull;
      break;
    }
    case TokenType.TRUE: {
      result = CompactDataBoolNull.CompactDataTrue;
      break;
    }
    case TokenType.FALSE: {
      result = CompactDataBoolNull.CompactDataFalse;
      break;
    }
    case TokenType.QUOTED: {
      result = new CompactDataQuoted(tok.value as string);
      break;
    }
    case TokenType.STRING: {
      result = new CompactDataString(tok.value as string);
      break;
    }
    case TokenType.INTEGER: {
      result = new CompactDataInteger(tok.value as number);
      break;
    }
    case TokenType.FLOAT: {
      result = new CompactDataFloat(tok.value as number);
      break;
    }
    case TokenType.BRACED: {
      result = new CompactDataString(tok.value as string);
      break;
    }
    default: {
      throw new ParserException(`Unknown token type in: ${tok.toS()}`);
    }
  }
  if (result !== null) {
    const peek = s.peek();
    if (peek && peek.type === TokenType.STRUCT_SEP) {
      throw new ParserException("Only one primitive is allowed at the root.");
    }
    if (
      peek &&
      (peek.type === TokenType.LPAREN || peek.type === TokenType.LBRACKET || peek.type === TokenType.EQUALS)
    ) {
      // Its not a primitive
      s.pushBack(tok);
      return null;
    } else if (peek) {
      throw new ParserException(`Unexpected token: ${peek.toS()}`);
    }
  }
  return result;
};

/**
 * Parse an array of CompactDataStructure objects from a TokenStream.
 *
 * @param s a TokenStream
 * @returns a CompactDataStructure array
 */
const parseStructures = (s: TokenStream): CompactDataStructure[] => {
  const result: CompactDataStructure[] = [];
  while (!s.empty()) {
    result.push(parseCompactDataValue(s) as CompactDataStructure);
    const maybeStructSep = s.next();
    if (maybeStructSep) {
      if (maybeStructSep.type === TokenType.STRUCT_SEP) {
        // ok
      } else {
        throw new ParserException(`Expected ';' near ${maybeStructSep.toS()}`);
      }
    }
  }
  return result;
};

/**
 *
 * @param s
 */
const parseCompactDataMap = (s: TokenStream): CompactDataMap => {
  const firstToken = s.next() as Token;
  // Its a map
  const mapEntries: CompactDataPair[] = [];
  while (!s.empty()) {
    let peek = s.peek();
    if (peek && peek.type === TokenType.RPAREN) {
      // Consume the peeked token and break
      s.next();
      break;
    }
    const mp = parseCompactDataValue(s);
    mapEntries.push(mp as CompactDataPair);

    peek = s.peek();
    if (peek) {
      if (peek.type === TokenType.RPAREN) {
        // Consume the peeked token
        s.next();
        break;
      }
      if (peek.type === TokenType.STRUCT_SEP) {
        // Consume the peeked token and continue
        s.next();
        peek = s.peek();
        if (peek && peek.type === TokenType.RPAREN) {
          throw new ParserException(`Unexpected ; before ] at ${peek}`);
        }
      }
    } else {
      throw new ParserException(`Expected ')' near ${firstToken.toS()}`);
    }
  }
  return new CompactDataMap(mapEntries);
};

/**
 *
 * @param s
 * @returns
 */
const parseCompactDataArray = (s: TokenStream): CompactDataArray => {
  const firstToken = s.next() as Token;
  // Its an array
  const arrayEntries: CompactDataValue[] = [];
  while (!s.empty()) {
    let peek = s.peek();
    if (peek && peek.type === TokenType.RBRACKET) {
      // Consume the peeked token and break
      s.next();
      break;
    }
    const ms = parseCompactDataValue(s);
    arrayEntries.push(ms);

    peek = s.peek();
    if (peek) {
      if (peek.type === TokenType.RBRACKET) {
        // Consume the peeked token and break
        s.next();
        break;
      }
      if (peek.type === TokenType.STRUCT_SEP) {
        // Consume the peeked token and continue
        s.next();
        peek = s.peek();
        if (peek && peek.type === TokenType.RBRACKET) {
          throw new ParserException(`Unexpected ; before ] at ${peek}`);
        }
      }
    } else {
      throw new ParserException(`Expected ']' near ${firstToken.toS()}`);
    }
  }
  return new CompactDataArray(arrayEntries);
};
/**
 * Parse CompactDataValues recursively from a TokenStream.
 *
 * @param s a TokenStream
 * @returns a CompactDataValue
 */
const parseCompactDataValue = (s: TokenStream): CompactDataValue => {
  const firstToken = s.next() as Token;

  if (firstToken.type === TokenType.LBRACKET) {
    s.pushBack(firstToken);
    return parseCompactDataArray(s);
  } else if (firstToken.type === TokenType.LPAREN) {
    s.pushBack(firstToken);
    return parseCompactDataMap(s);
  } else if (
    firstToken.type === TokenType.STRING ||
    firstToken.type === TokenType.QUOTED ||
    firstToken.type === TokenType.BRACED
  ) {
    const peek = s.peek();

    const key = firstToken.value as string;
    if (peek && peek.type === TokenType.EQUALS) {
      // its a pair
      // Consume the = token
      s.next();
      return new CompactDataPair(key, parsePairValue(s));
    }

    if (peek && (peek.type === TokenType.LBRACKET || peek.type === TokenType.LPAREN)) {
      // Its still a pair
      return new CompactDataPair(key, parsePairValue(s));
    }

    if (
      !peek ||
      (peek &&
        (peek.type === TokenType.STRUCT_SEP || peek.type === TokenType.RPAREN || peek.type === TokenType.RBRACKET))
    ) {
      // Its simply a string or quoted string
      if (firstToken.type === TokenType.STRING || firstToken.type === TokenType.BRACED) {
        return new CompactDataString(firstToken.value as string);
      } else {
        return new CompactDataQuoted(firstToken.value as string);
      }
    }

    throw new ParserException(`Unexpected token: '${firstToken.toS()}'`);
  } else if (firstToken.type === TokenType.INTEGER) {
    return new CompactDataInteger(firstToken.value as number);
  } else if (firstToken.type === TokenType.FLOAT) {
    return new CompactDataFloat(firstToken.value as number);
  } else if (firstToken.type === TokenType.NULL) {
    return CompactDataBoolNull.CompactDataNull;
  } else if (firstToken.type === TokenType.TRUE) {
    return CompactDataBoolNull.CompactDataTrue;
  } else if (firstToken.type === TokenType.FALSE) {
    return CompactDataBoolNull.CompactDataFalse;
  } else {
    s.pushBack(firstToken);
    const maybePrimitive = parsePrimitive(s);
    if (maybePrimitive) {
      return maybePrimitive;
    }
  }
  throw new ParserException(`Unexpected token: '${firstToken.toS()}'`);
};
/**
 * Parse CompactDataValues recursively from a TokenStream.
 *
 * @param s a TokenStream
 * @returns a CompactDataValue
 */
const parsePairValue = (s: TokenStream): CompactDataPrimitive | CompactDataMap | CompactDataArray => {
  const firstToken = s.next() as Token;

  if (firstToken.type === TokenType.LBRACKET) {
    s.pushBack(firstToken);
    return parseCompactDataArray(s);
  } else if (firstToken.type === TokenType.LPAREN) {
    s.pushBack(firstToken);
    return parseCompactDataMap(s);
  } else if (
    firstToken.type === TokenType.STRING ||
    firstToken.type === TokenType.QUOTED ||
    firstToken.type === TokenType.BRACED
  ) {
    const peek = s.peek();

    if (peek && peek.type === TokenType.EQUALS) {
      throw new ParserException(`Unexpected token: '${firstToken.toS()}'`);
    }

    if (peek && (peek.type === TokenType.LBRACKET || peek.type === TokenType.LPAREN)) {
      // Its still a pair
      throw new ParserException(`Unexpected token: '${firstToken.toS()}'`);
    }

    if (
      !peek ||
      (peek &&
        (peek.type === TokenType.STRUCT_SEP || peek.type === TokenType.RPAREN || peek.type === TokenType.RBRACKET))
    ) {
      // Its simply a string or quoted string
      if (firstToken.type === TokenType.STRING || firstToken.type === TokenType.BRACED) {
        return new CompactDataString(firstToken.value as string);
      } else {
        return new CompactDataQuoted(firstToken.value as string);
      }
    }

    throw new ParserException(`Unexpected token: '${firstToken.toS()}'`);
  } else if (firstToken.type === TokenType.INTEGER) {
    return new CompactDataInteger(firstToken.value as number);
  } else if (firstToken.type === TokenType.FLOAT) {
    return new CompactDataFloat(firstToken.value as number);
  } else if (firstToken.type === TokenType.NULL) {
    return CompactDataBoolNull.CompactDataNull;
  } else if (firstToken.type === TokenType.TRUE) {
    return CompactDataBoolNull.CompactDataTrue;
  } else if (firstToken.type === TokenType.FALSE) {
    return CompactDataBoolNull.CompactDataFalse;
  } else {
    s.pushBack(firstToken);
    const maybePrimitive = parsePrimitive(s);
    if (maybePrimitive) {
      return maybePrimitive;
    }
  }

  throw new ParserException(`Unexpected token: '${firstToken.toS()}'`);
};
