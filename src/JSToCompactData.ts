import { createUnicodeEscaper } from "./UnicodeEscaper";
import { escapeAndQuote, isNonStringPrimitive } from "./StringifyUtils";

export interface JSToCompactData {
  objectToCompactData(node: object): string | null;
}

export const createJSToCompactData = (): JSToCompactData => {
  return new JSToCompactDataImpl();
};

class JSToCompactDataImpl implements JSToCompactData {
  objectToCompactData(node: object): string | null {
    const compactdataResult: string | null = Array.isArray(node)
      ? pairToCompactDataRecursive("", node)
      : toTopLevelCompactData(node);

    return compactdataResult;
  }
}

const escaper = createUnicodeEscaper();

const pairToCompactDataRecursive = (key: string, node: object | string | number | boolean | null): string => {
  let escapedKey = escaper.escape(key);
  if (isNonStringPrimitive(escapedKey)) {
    escapedKey = '"' + escapedKey + '"';
  }
  if (node === null) {
    return `${escapedKey}=null`;
  }
  if (Array.isArray(node)) {
    return escapedKey + arrayToCompactDataArray(node);
  }
  if (typeof node === "object") {
    return `${escapedKey}${objectToCompactDataMap(node)}`;
  }
  const result: string | null = primitiveToCompactData(escapedKey, node);
  return result ? result : `${escapedKey}=${toCompactData(node)}`;
};

function toTopLevelCompactData(node: object | string | number | boolean | null): string | null {
  if (node === null) {
    return "null";
  }
  if (typeof node === "object" && !Array.isArray(node)) {
    return objectToCompactDataMapWithoutParentheses(node);
  }
  return toCompactData(node);
}

function arrayToCompactDataArray(node: Array<object>): string {
  return "[" + node.map(toCompactDataInArray).join(";") + "]";
}

function objectToCompactDataMapWithoutParentheses(node: object): string | null {
  if (typeof node !== "object") {
    return primitiveNodeToCompactData(node);
  }
  if (Array.isArray(node)) {
    return arrayToCompactDataArray(node);
  }
  return Object.keys(node)
    .map((k) => pairToCompactDataRecursive(k, node[k]))
    .join(";");
}

function objectToCompactDataMap(node: object): string | null {
  if (typeof node !== "object") {
    return primitiveNodeToCompactData(node);
  }
  if (Array.isArray(node)) {
    return arrayToCompactDataArray(node);
  }
  if (node === null) {
    return null;
  }
  const keys = Object.keys(node);
  return `(${keys.map((k) => pairToCompactDataRecursive(k, node[k])).join(";")})`;
}

function objectToCompactDataMapInArray(node: object | string | number | boolean | null): string | null {
  if (typeof node !== "object") {
    return primitiveNodeToCompactData(node);
  }
  if (Array.isArray(node)) {
    return arrayToCompactDataArray(node);
  }
  if (node === null) {
    return null;
  }
  const keys = Object.keys(node);
  if (keys.length > 1) {
    return `(${keys.map((k) => pairToCompactDataRecursive(k, node[k])).join(";")})`;
  } else if (keys.length === 0) {
    return "()";
  } else {
    return keys.map((k) => pairToCompactDataRecursive(k, node[k])).join("");
  }
}

function primitiveToCompactData(key: string, node: object | string | number | boolean | null): string | null {
  const nodeAsString: string | null = primitiveNodeToCompactData(node);
  if (nodeAsString !== null) {
    return key + "=" + nodeAsString;
  }
  return null;
}

function toCompactData(node: object | string | number | boolean | null): string | null {
  if (node && Array.isArray(node)) {
    return arrayToCompactDataArray(node);
  }
  if (node && typeof node === "object") {
    return objectToCompactDataMap(node);
  }
  return primitiveNodeToCompactData(node);
}

function toCompactDataInArray(node: object | string | number | boolean | null): string | null {
  if (node && Array.isArray(node)) {
    return arrayToCompactDataArray(node);
  }
  if (node && typeof node === "object") {
    return objectToCompactDataMapInArray(node);
  }
  return primitiveNodeToCompactData(node);
}

const primitiveNodeToCompactData = (node: object | string | number | boolean | null): string | null => {
  //
  // Handling for nulls
  //
  if (node === null) {
    return "null";
  }
  //
  // Handling for strings
  //
  if (typeof node === "string") {
    if ("null" === node) {
      return "`null`";
    } else {
      return escapeAndQuote(node);
    }
  }
  //
  // Handling for booleans
  //
  if (typeof node === "boolean") {
    return node ? "true" : "false";
  }
  //
  // Handling for numbers
  //
  if (typeof node === "number") {
    if (Number.isInteger(node)) {
      return `${node}`;
    }
    return `${node.toExponential().replace("e+", "E")}`;
  }
  return null;
};
