import { expect } from "chai";
import { createJSToCompactData } from "../src/JSToCompactData";

describe("JsonToCompactData", () => {
  it("should be able to create a JsonToCompactData instance", () => {
    const jsonToCompactData = createJSToCompactData();
    expect(jsonToCompactData).not.equal(null);
  });

  it("001 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "o(n=Tesco;s=Every Little Helps;c[fb=tesco])";
    const jsonString =
      "{\n" +
      '    "o": {\n' +
      '        "n": "Tesco",\n' +
      '        "s": "Every Little Helps",\n' +
      '        "c": [{\n' +
      '            "fb": "tesco"\n' +
      "        }]\n" +
      "    }\n" +
      "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("002 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString =
      "organisation(name=Tesco;slogan=Every Little Helps;contacts[facebook(value=t;object_type=media;object_display_name=Facebook;description_default=View Facebook profile;prefix=https://www.facebook.com/;media_type=3p;controller=facebook.com)];object_type=entity;object_display_name=Organisation;description_default=View Organisation)";
    const jsonString =
      "{\n" +
      '    "organisation": {\n' +
      '        "name": "Tesco",\n' +
      '        "slogan": "Every Little Helps",\n' +
      '        "contacts": [\n' +
      "            {\n" +
      '                "facebook": {\n' +
      '                    "value": "t",\n' +
      '                    "object_type": "media",\n' +
      '                    "object_display_name": "Facebook",\n' +
      '                    "description_default": "View Facebook profile",\n' +
      '                    "prefix": "https://www.facebook.com/",\n' +
      '                    "media_type": "3p",\n' +
      '                    "controller": "facebook.com"\n' +
      "                }\n" +
      "            }\n" +
      "        ],\n" +
      '        "object_type": "entity",\n' +
      '        "object_display_name": "Organisation",\n' +
      '        "description_default": "View Organisation"\n' +
      "    }\n" +
      "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("003 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "test=abc;array[1;2;3;4;5;6];map(one=1;two=2;three=3;four=4;five=5);bool=true";
    const jsonString =
      "{\n" +
      '  "test": "abc",\n' +
      '  "array": [\n' +
      "    1,\n" +
      "    2,\n" +
      "    3,\n" +
      "    4,\n" +
      "    5,\n" +
      "    6\n" +
      "  ],\n" +
      '  "map": {\n' +
      '    "one": 1,\n' +
      '    "two": 2,\n' +
      '    "three": 3,\n' +
      '    "four": 4,\n' +
      '    "five": 5\n' +
      "    },\n" +
      '    "bool":true\n' +
      "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("004 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString =
      "[-1.249811539351663E9;(fierce(human=-1409341354;joined=false;thank=-530822508;most=plate;effort=palace;friendly=true);rocky=heading;catch=758568953;fort=602784226;magnet=suddenly;chart=open);1018881981;true;-1.5146412301975923E9;arrive]";
    const jsonString =
      "[\n" +
      "  -1249811539.351663,\n" +
      "  {\n" +
      '    "fierce": {\n' +
      '      "human": -1409341354,\n' +
      '      "joined": false,\n' +
      '      "thank": -530822508,\n' +
      '      "most": "plate",\n' +
      '      "effort": "palace",\n' +
      '      "friendly": true\n' +
      "    },\n" +
      '    "rocky": "heading",\n' +
      '    "catch": 758568953,\n' +
      '    "fort": 602784226,\n' +
      '    "magnet": "suddenly",\n' +
      '    "chart": "open"\n' +
      "  },\n" +
      "  1018881981,\n" +
      "  true,\n" +
      "  -1514641230.1975923,\n" +
      '  "arrive"\n' +
      "]";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("005 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString =
      "construction(apartment=-9.862013445343103E8;control=notice;tales=1.281312255925046E9;neighborhood=true;only=chest;think=disease);little[[took;332484;4.1355709678840065E8;-148258887;1.5130269100251818E8;1692764744];constantly;affect;true;false;chart];canal=sister;happy=lead;bread=false;rays=1140850299";
    const jsonString =
      "{\n" +
      '  "construction": {\n' +
      '    "apartment": -986201344.5343103,\n' +
      '    "control": "notice",\n' +
      '    "tales": 1281312255.925046,\n' +
      '    "neighborhood": true,\n' +
      '    "only": "chest",\n' +
      '    "think": "disease"\n' +
      "  },\n" +
      '  "little": [\n' +
      "    [\n" +
      '      "took",\n' +
      "      332484,\n" +
      "      413557096.78840065,\n" +
      "      -148258887,\n" +
      "      151302691.00251818,\n" +
      "      1692764744\n" +
      "    ],\n" +
      '    "constantly",\n' +
      '    "affect",\n' +
      "    true,\n" +
      "    false,\n" +
      '    "chart"\n' +
      "  ],\n" +
      '  "canal": "sister",\n' +
      '  "happy": "lead",\n' +
      '  "bread": false,\n' +
      '  "rays": 1140850299\n' +
      "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("006 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString =
      "exist(means[true;[[(whale();thumb=last;call(view=true;due[[];true;[true;customs];true];primitive=give));()];program;[1.563450609802394E9];day=1172874783];-1.0705971128199496E9];ruler=sort;bound=including;machinery[1.362410394070498E9;fog=drink])";
    const jsonString =
      "{\n" +
      '  "exist": {\n' +
      '    "means": [\n' +
      "      true,\n" +
      "      [\n" +
      "        [\n" +
      "          {\n" +
      '            "whale": {},\n' +
      '            "thumb": "last",\n' +
      '            "call": {\n' +
      '              "view": true,\n' +
      '              "due": [\n' +
      "                [],\n" +
      "                true,\n" +
      "                [\n" +
      "                  true,\n" +
      '                  "customs"\n' +
      "                ],\n" +
      "                true\n" +
      "              ],\n" +
      '              "primitive": "give"\n' +
      "            }\n" +
      "          },\n" +
      "          {}\n" +
      "        ],\n" +
      '        "program",\n' +
      "        [\n" +
      "          1563450609.802394\n" +
      "        ],\n" +
      "        {\n" +
      '          "day": 1172874783\n' +
      "        }\n" +
      "      ],\n" +
      "      -1070597112.8199496\n" +
      "    ],\n" +
      '    "ruler": "sort",\n' +
      '    "bound": "including",\n' +
      '    "machinery": [\n' +
      "      1362410394.070498,\n" +
      "      {\n" +
      '        "fog": "drink"\n' +
      "      }\n" +
      "    ]\n" +
      "  }\n" +
      "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("007 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString =
      "[organisation(name=Tesco;slogan=Every Little Helps;contacts[facebook(value=t;object_type=media;object_display_name=Facebook;description_default=View Facebook profile;prefix=https://www.facebook.com/;media_type=3p;controller=facebook.com)];object_type=entity;object_display_name=Organisation;description_default=View Organisation)]";
    const jsonString =
      "[{\n" +
      '    "organisation": {\n' +
      '        "name": "Tesco",\n' +
      '        "slogan": "Every Little Helps",\n' +
      '        "contacts": [\n' +
      "            {\n" +
      '                "facebook": {\n' +
      '                    "value": "t",\n' +
      '                    "object_type": "media",\n' +
      '                    "object_display_name": "Facebook",\n' +
      '                    "description_default": "View Facebook profile",\n' +
      '                    "prefix": "https://www.facebook.com/",\n' +
      '                    "media_type": "3p",\n' +
      '                    "controller": "facebook.com"\n' +
      "                }\n" +
      "            }\n" +
      "        ],\n" +
      '        "object_type": "entity",\n' +
      '        "object_display_name": "Organisation",\n' +
      '        "description_default": "View Organisation"\n' +
      "    }\n" +
      "}]";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("008 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "[(a=b;c=d);(e=f;g=h)]";
    const jsonString =
      "[\n" +
      "    {\n" +
      '        "a": "b",\n' +
      '        "c": "d"\n' +
      "    },\n" +
      "    {\n" +
      '        "e": "f",\n' +
      '        "g": "h"\n' +
      "    }\n" +
      "]";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("009 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "key=Valu®¥π∏";
    const jsonString = "{\n" + '  "key":"Valu®¥π∏"\n' + "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("010 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "key®¥π∏=Valu®¥π∏";
    const jsonString = "{\n" + '  "key®¥π∏":"Valu®¥π∏"\n' + "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("011 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "key=null";
    const jsonString = "{\n" + '  "key":null\n' + "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("012 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "key=`null`";
    const jsonString = '{"key":"null"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("013 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "key=``";
    const jsonString = '{"key":""}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("014 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "key👶=Value👶";
    const jsonString = '{"key\uD83D\uDC76":"Value\uD83D\uDC76"}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("015 - should be able to convert JSON to MODL", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString =
      "hours(original[d@8-20@LON;7@9-18];days[(date=2019-12-13;available[08:00:00-20:00:00]);(date=2019-12-14;available[08:00:00-20:00:00]);(date=2019-12-15;available[09:00:00-18:00:00])])";
    const jsonString =
      "{\n" +
      '          "hours": {\n' +
      '            "original": [\n' +
      '              "d@8-20@LON",\n' +
      '              "7@9-18"\n' +
      "            ],\n" +
      '            "days": [\n' +
      "              {\n" +
      '                "date": "2019-12-13",\n' +
      '                "available": [\n' +
      '                  "08:00:00-20:00:00"\n' +
      "                ]\n" +
      "              },\n" +
      "              {\n" +
      '                "date": "2019-12-14",\n' +
      '                "available": [\n' +
      '                  "08:00:00-20:00:00"\n' +
      "                ]\n" +
      "              },\n" +
      "              {\n" +
      '                "date": "2019-12-15",\n' +
      '                "available": [\n' +
      '                  "09:00:00-18:00:00"\n' +
      "                ]\n" +
      "              }\n" +
      "           ]\n" +
      "        }\n" +
      "}";

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("016 - should be able to convert JSON to MODL and create orphan pairs", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "@n=1;o(c[tw=share;li=shareArticle];n=SBL Accountants)";
    const jsonString = '{"@n":1,"o":{"c":[{"tw":"share"},{"li":"shareArticle"}],"n":"SBL Accountants"}}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("017 - should be able to convert JSON to MODL and handle nulls", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "@n=1;o[SBL Accountants;null;[tw=share;li=shareArticle]]";
    const jsonString = '{"@n":1,"o":["SBL Accountants",null,[{"tw":"share"},{"li":"shareArticle"}]]}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("018 - should use the form `a(b(c=1))` rather than `a=b=c=1`", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "a(b(c=1))";
    const jsonString = '{"a":{"b":{"c":1}}}';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });

  it("019 - should use the form `[c=1]` rather than `[(c=1)]` in an array", () => {
    const jsonToCompactData = createJSToCompactData();

    const compactdataString = "[c=1]";
    const jsonString = '[{"c":1}]';

    expect(jsonToCompactData.objectToCompactData(JSON.parse(jsonString))).equal(compactdataString);
  });
});
