import { expect } from "chai";
import { createJSToCompactData } from "../src/JSToCompactData";

describe("Primitives Tests", () => {
  it("can handle numbers as strings", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=`1234`";
    const jsonString = '{"t":"1234"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it('can handle numbers starting with "+" as strings', () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=+1234";
    const jsonString = '{"t":"+1234"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("can handle numbers as numbers", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=1234";
    const jsonString = '{"t":1234}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("can handle booleans as strings", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=`true`;f=`false`";
    const jsonString = '{"t":"true", "f":"false"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("can handle booleans as booleans", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=01;f=00";
    const jsonString = '{"t":"01", "f":"00"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("can handle nulls as strings", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=`null`";
    const jsonString = '{"t":"null"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("can handle nulls as nulls", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=000";
    const jsonString = '{"t":"000"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("does not add graves for colons", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=http://example.com";
    const jsonString = '{"t":"http://example.com"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("replaces NBSP with SP", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=Hello World !";
    const jsonString = '{"t":"Hello\u00a0World\u00a0!"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("replaces double-quoted strings with single quoted strings", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=`Hello World!`";
    const jsonString = '{"t":"\\"Hello World!\\""}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("replaces embedded double-quoted strings with unicode escaped strings", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "t=Hello ~u0022quoted~u0022 World!";
    const jsonString = '{"t":"Hello \\"quoted\\" World!"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("grave-quotes bare spaces", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "[a;` `]";
    const jsonString = '["a", " "]';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });
});
