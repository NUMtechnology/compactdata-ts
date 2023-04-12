import { expect } from "chai";
import {
  CompactDataArray,
  CompactDataBoolNull,
  CompactDataFloat,
  CompactDataInteger,
  CompactDataMap,
  CompactDataPair,
  CompactDataQuoted,
  CompactDataString,
  CompactDataStructure,
} from "../src/Model";
import { parseCompactData } from "../src/CompactDataParser";

describe("CompactDataParser", () => {
  it("Can parse a string primitive at the root", () => {
    const compactdata = parseCompactData("hello");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("hello");
  });

  it("Can parse a float primitive at the root", () => {
    const compactdata = parseCompactData("2.54");
    const value = compactdata.s as CompactDataFloat;
    expect(value.value).to.equal(2.54);
  });

  it("Can parse a telephone primitive at the root", () => {
    const compactdata = parseCompactData("+441270123456");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("+441270123456");
  });

  it("Can parse a telephone primitive in a pair", () => {
    const compactdata = parseCompactData("x=+441270123456");
    const pairs = compactdata.s as Array<CompactDataPair>;
    const pairValue = pairs[0].value as CompactDataString;
    const value = pairValue.value;
    expect(value).to.equal("+441270123456");
  });

  it("Can parse an integer primitive at the root", () => {
    const compactdata = parseCompactData("99");
    const value = compactdata.s as CompactDataInteger;
    expect(value.value).to.equal(99);
  });

  it("Can parse a quoted primitive at the root", () => {
    const compactdata = parseCompactData("`hello`");
    const value = compactdata.s as CompactDataQuoted;
    expect(value.value).to.equal("`hello`");
  });

  it("Can parse a null primitive at the root", () => {
    const compactdata = parseCompactData("null");
    const value = compactdata.s as CompactDataBoolNull;
    expect(value).to.equal(CompactDataBoolNull.CompactDataNull);
  });

  it("Can parse a true primitive at the root", () => {
    const compactdata = parseCompactData("true");
    const value = compactdata.s as CompactDataBoolNull;
    expect(value).to.equal(CompactDataBoolNull.CompactDataTrue);
  });

  it("Can parse a false primitive at the root", () => {
    const compactdata = parseCompactData("false");
    const value = compactdata.s as CompactDataBoolNull;
    expect(value).to.equal(CompactDataBoolNull.CompactDataFalse);
  });

  it("Can parse an empty map", () => {
    const compactdata = parseCompactData("()");
    const value = compactdata.s as CompactDataStructure[];
    expect(value.length).to.equal(1);
    const map = value[0] as CompactDataMap;
    expect(map.items.length).to.equal(0);
  });

  it("Can parse an empty array", () => {
    const compactdata = parseCompactData("[]");
    const value = compactdata.s as CompactDataStructure[];
    expect(value.length).to.equal(1);
    const array = value[0] as CompactDataArray;
    expect(array.items.length).to.equal(0);
  });

  it("Can parse an empty map with ending semicolon", () => {
    const compactdata = parseCompactData("();");
    const value = compactdata.s as CompactDataStructure[];
    expect(value.length).to.equal(1);
    const map = value[0] as CompactDataMap;
    expect(map.items.length).to.equal(0);
  });

  it("Can parse an empty array with ending semicolon", () => {
    const compactdata = parseCompactData("[];");
    const value = compactdata.s as CompactDataStructure[];
    expect(value.length).to.equal(1);
    const array = value[0] as CompactDataArray;
    expect(array.items.length).to.equal(0);
  });

  it("Can parse a CompactData Pair at the root", () => {
    const compactdata = parseCompactData("a=b");
    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);
    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal("a");
    const value = pair.value as CompactDataString;
    expect(value.value).to.equal("b");
  });

  it("Can parse a CompactData Pair with quotes at the root - 1", () => {
    const compactdata = parseCompactData('"a"="b"');
    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);
    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal('"a"');
    const value = pair.value as CompactDataString;
    expect(value.value).to.equal('"b"');
  });

  it("Can parse a CompactData Pair with quotes at the root - 2", () => {
    const compactdata = parseCompactData("`a`=`b`");
    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);
    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal("`a`");
    const value = pair.value as CompactDataString;
    expect(value.value).to.equal("`b`");
  });

  it("Can parse a CompactData Pair with quotes and embedded CompactData tokens", () => {
    const compactdata = parseCompactData('"a=[];()b"="c=[];()d"');
    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);
    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal('"a=[];()b"');
    const value = pair.value as CompactDataString;
    expect(value.value).to.equal('"c=[];()d"');
  });

  it("Can parse a list of CompactData Pairs at the root", () => {
    const compactdata = parseCompactData("a=b;c=d;e=f");
    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(3);
    const p1 = structures[0] as CompactDataPair;
    const p2 = structures[1] as CompactDataPair;
    const p3 = structures[2] as CompactDataPair;
    const v1 = p1.value as CompactDataString;
    const v2 = p2.value as CompactDataString;
    const v3 = p3.value as CompactDataString;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("b");
    expect(v2.value).to.equal("d");
    expect(v3.value).to.equal("f");
  });

  it("Can parse a CompactData Map at the root", () => {
    const compactdata = parseCompactData("(a=b;c=d;e=f)");

    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);

    const map = structures[0] as CompactDataMap;
    const mapEntries = map.items;
    expect(mapEntries.length).to.equal(3);

    const p1 = mapEntries[0] as CompactDataPair;
    const p2 = mapEntries[1] as CompactDataPair;
    const p3 = mapEntries[2] as CompactDataPair;
    const v1 = p1.value as CompactDataString;
    const v2 = p2.value as CompactDataString;
    const v3 = p3.value as CompactDataString;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("b");
    expect(v2.value).to.equal("d");
    expect(v3.value).to.equal("f");
  });

  it("Can parse a CompactData Array at the root", () => {
    const compactdata = parseCompactData("[a=b;c=d;e=f]");

    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);

    const array = structures[0] as CompactDataArray;
    const arrayEntries = array.items;
    expect(arrayEntries.length).to.equal(3);

    const p1 = arrayEntries[0] as CompactDataPair;
    const p2 = arrayEntries[1] as CompactDataPair;
    const p3 = arrayEntries[2] as CompactDataPair;
    const v1 = p1.value as CompactDataString;
    const v2 = p2.value as CompactDataString;
    const v3 = p3.value as CompactDataString;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("b");
    expect(v2.value).to.equal("d");
    expect(v3.value).to.equal("f");
  });

  it("Can parse a Pair with a Map at the root using =", () => {
    const compactdata = parseCompactData("x=(a=b;c=d;e=f)");

    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);

    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal("x");

    const map = pair.value as CompactDataMap;
    const mapEntries = map.items;
    expect(mapEntries.length).to.equal(3);

    const p1 = mapEntries[0] as CompactDataPair;
    const p2 = mapEntries[1] as CompactDataPair;
    const p3 = mapEntries[2] as CompactDataPair;
    const v1 = p1.value as CompactDataString;
    const v2 = p2.value as CompactDataString;
    const v3 = p3.value as CompactDataString;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("b");
    expect(v2.value).to.equal("d");
    expect(v3.value).to.equal("f");
  });

  it("Can parse a Pair with a Map at the root not using =", () => {
    const compactdata = parseCompactData("x(a=b;c=d;e=f)");

    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);

    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal("x");

    const map = pair.value as CompactDataMap;
    const mapEntries = map.items;
    expect(mapEntries.length).to.equal(3);

    const p1 = mapEntries[0] as CompactDataPair;
    const p2 = mapEntries[1] as CompactDataPair;
    const p3 = mapEntries[2] as CompactDataPair;
    const v1 = p1.value as CompactDataString;
    const v2 = p2.value as CompactDataString;
    const v3 = p3.value as CompactDataString;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("b");
    expect(v2.value).to.equal("d");
    expect(v3.value).to.equal("f");
  });

  it("Can parse a CompactData Array at the root using =", () => {
    const compactdata = parseCompactData("x=[a=b;c=d;e=f]");

    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);

    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal("x");

    const array = pair.value as CompactDataArray;
    const arrayEntries = array.items;
    expect(arrayEntries.length).to.equal(3);

    const p1 = arrayEntries[0] as CompactDataPair;
    const p2 = arrayEntries[1] as CompactDataPair;
    const p3 = arrayEntries[2] as CompactDataPair;
    const v1 = p1.value as CompactDataString;
    const v2 = p2.value as CompactDataString;
    const v3 = p3.value as CompactDataString;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("b");
    expect(v2.value).to.equal("d");
    expect(v3.value).to.equal("f");
  });

  it("Can parse a CompactData Array at the root not using =", () => {
    const compactdata = parseCompactData("x[a=b;c=d;e=f]");

    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);

    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal("x");

    const array = pair.value as CompactDataArray;
    const arrayEntries = array.items;
    expect(arrayEntries.length).to.equal(3);

    const p1 = arrayEntries[0] as CompactDataPair;
    const p2 = arrayEntries[1] as CompactDataPair;
    const p3 = arrayEntries[2] as CompactDataPair;
    const v1 = p1.value as CompactDataString;
    const v2 = p2.value as CompactDataString;
    const v3 = p3.value as CompactDataString;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("b");
    expect(v2.value).to.equal("d");
    expect(v3.value).to.equal("f");
  });

  it("Can reject a=b=1", () => {
    expect(() => parseCompactData("a=b=1")).to.throw(
      Error,
      "Unexpected token: 'type: STRING, from: 2, to: 3, value: \"b\"'"
    );
  });

  it("Can parse a brace-string", () => {
    const compactdata = parseCompactData("{hello}");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("{hello}");
  });

  it("Can parse a complex brace-string - 1", () => {
    const compactdata = parseCompactData("{he(){llo~}[];:`\"' \n\t\b\v\rWorld}");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("{he(){llo~}[];:`\"' \n\t\b\v\rWorld}");
  });

  it("Can parse a complex brace-string - 2", () => {
    const compactdata = parseCompactData("{he(llo~}[];:`\"' \n\t\b\v\rWorld}");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("{he(llo~}[];:`\"' \n\t\b\v\rWorld}");
  });

  it("Can parse a complex brace-string - 3", () => {
    const compactdata = parseCompactData("x[a={b};c={d};e={f}]");

    const structures = compactdata.s as CompactDataStructure[];
    expect(structures.length).to.equal(1);

    const pair = structures[0] as CompactDataPair;
    expect(pair.key).to.equal("x");

    const array = pair.value as CompactDataArray;
    const arrayEntries = array.items;
    expect(arrayEntries.length).to.equal(3);

    const p1 = arrayEntries[0] as CompactDataPair;
    const p2 = arrayEntries[1] as CompactDataPair;
    const p3 = arrayEntries[2] as CompactDataPair;
    const v1 = p1.value as CompactDataQuoted;
    const v2 = p2.value as CompactDataQuoted;
    const v3 = p3.value as CompactDataQuoted;
    expect(p1.key).to.equal("a");
    expect(p2.key).to.equal("c");
    expect(p3.key).to.equal("e");
    expect(v1.value).to.equal("{b}");
    expect(v2.value).to.equal("{d}");
    expect(v3.value).to.equal("{f}");
  });

  it("Can parse a complex brace-string - 4", () => {
    const compactdata = parseCompactData("{~~}");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("{~~}");
  });

  it("Can parse a complex brace-string - 5", () => {
    const compactdata = parseCompactData("{\\\\}");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("{\\\\}");
  });

  it("Can parse a complex brace-string - 6", () => {
    const compactdata = parseCompactData("{\\}}");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("{\\}}");
  });

  it("Can parse a complex brace-string - 7", () => {
    const compactdata = parseCompactData("{~}}");
    const value = compactdata.s as CompactDataString;
    expect(value.value).to.equal("{~}}");
  });

  it("Can reject a bad brace-string - 1", () => {
    expect(() => parseCompactData("{hello} world")).to.throw(
      Error,
      'Unexpected token: type: STRING, from: 8, to: 13, value: "world"'
    );
  });

  it("Can reject a bad brace-string - 2", () => {
    expect(() => parseCompactData("{hello")).to.throw(Error, "Unclosed quote: } in {hello near 0:6");
  });
});
