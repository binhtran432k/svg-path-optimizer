import { describe, expect, test } from "bun:test";

import { createPathItems } from "./path-item.js";

describe("createSvgItems()", () => {
	test("can create", () => {
		expect(createPathItems("M0 0")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      0,
      0,
    ],
  },
]
`);
	});
	test("can create move to group", () => {
		expect(createPathItems("M0 0 1 2")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      0,
      0,
    ],
  },
  {
    "cmd": "L",
    "isAbsolute": true,
    "upperCmd": "L",
    "values": [
      1,
      2,
    ],
  },
]
`);
	});
	test("can create negative", () => {
		expect(createPathItems("M-1-2")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      -1,
      -2,
    ],
  },
]
`);
	});
	test("can create float", () => {
		expect(createPathItems("M.1-.2")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      0.1,
      -0.2,
    ],
  },
]
`);
	});
	test("can create untrim", () => {
		expect(createPathItems("  M0 0  Z  ")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      0,
      0,
    ],
  },
  {
    "cmd": "Z",
    "isAbsolute": true,
    "upperCmd": "Z",
    "values": [],
  },
]
`);
	});
	test("ignore invalid", () => {
		expect(createPathItems("b0 0")).toMatchInlineSnapshot("[]");
	});
	test("can create move to", () => {
		expect(createPathItems("M0 1m10 20")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      0,
      1,
    ],
  },
  {
    "cmd": "m",
    "isAbsolute": false,
    "upperCmd": "M",
    "values": [
      10,
      20,
    ],
  },
]
`);
	});
	test("can create line to", () => {
		expect(createPathItems("L0 1l10 20")).toMatchInlineSnapshot(`
[
  {
    "cmd": "L",
    "isAbsolute": true,
    "upperCmd": "L",
    "values": [
      0,
      1,
    ],
  },
  {
    "cmd": "l",
    "isAbsolute": false,
    "upperCmd": "L",
    "values": [
      10,
      20,
    ],
  },
]
`);
	});
	test("can create horizontal line to", () => {
		expect(createPathItems("H0h10")).toMatchInlineSnapshot(`
[
  {
    "cmd": "H",
    "isAbsolute": true,
    "upperCmd": "H",
    "values": [
      0,
    ],
  },
  {
    "cmd": "h",
    "isAbsolute": false,
    "upperCmd": "H",
    "values": [
      10,
    ],
  },
]
`);
	});
	test("can create vertical line to", () => {
		expect(createPathItems("V0v10")).toMatchInlineSnapshot(`
[
  {
    "cmd": "V",
    "isAbsolute": true,
    "upperCmd": "V",
    "values": [
      0,
    ],
  },
  {
    "cmd": "v",
    "isAbsolute": false,
    "upperCmd": "V",
    "values": [
      10,
    ],
  },
]
`);
	});
	test("can create close path", () => {
		expect(createPathItems("Zz")).toMatchInlineSnapshot(`
[
  {
    "cmd": "Z",
    "isAbsolute": true,
    "upperCmd": "Z",
    "values": [],
  },
  {
    "cmd": "z",
    "isAbsolute": false,
    "upperCmd": "Z",
    "values": [],
  },
]
`);
	});
	test("can create curve to", () => {
		expect(
			createPathItems("C20 20, 40 20, 50 10c2 2, 4 2, 5 1"),
		).toMatchInlineSnapshot(`
[
  {
    "cmd": "C",
    "isAbsolute": true,
    "upperCmd": "C",
    "values": [
      20,
      20,
      40,
      20,
      50,
      10,
    ],
  },
  {
    "cmd": "c",
    "isAbsolute": false,
    "upperCmd": "C",
    "values": [
      2,
      2,
      4,
      2,
      5,
      1,
    ],
  },
]
`);
	});
	test("can create short curve to", () => {
		expect(createPathItems("S40 20, 50 10s4 2, 5 1")).toMatchInlineSnapshot(`
[
  {
    "cmd": "S",
    "isAbsolute": true,
    "upperCmd": "S",
    "values": [
      40,
      20,
      50,
      10,
    ],
  },
  {
    "cmd": "s",
    "isAbsolute": false,
    "upperCmd": "S",
    "values": [
      4,
      2,
      5,
      1,
    ],
  },
]
`);
	});
	test("can create quadratic curve to", () => {
		expect(createPathItems("Q20 20, 50 10q2 2, 5 1")).toMatchInlineSnapshot(`
[
  {
    "cmd": "Q",
    "isAbsolute": true,
    "upperCmd": "Q",
    "values": [
      20,
      20,
      50,
      10,
    ],
  },
  {
    "cmd": "q",
    "isAbsolute": false,
    "upperCmd": "Q",
    "values": [
      2,
      2,
      5,
      1,
    ],
  },
]
`);
	});
	test("can create short quadratic curve to", () => {
		expect(createPathItems("T50 10t5 1")).toMatchInlineSnapshot(`
[
  {
    "cmd": "T",
    "isAbsolute": true,
    "upperCmd": "T",
    "values": [
      50,
      10,
    ],
  },
  {
    "cmd": "t",
    "isAbsolute": false,
    "upperCmd": "T",
    "values": [
      5,
      1,
    ],
  },
]
`);
	});
	test("can create ecliptical arc to", () => {
		expect(
			createPathItems("A 45 45, 0, 0, 0, 125 125a4.5 4.5,0,0,0,12.5 12.5"),
		).toMatchInlineSnapshot(`
[
  {
    "cmd": "A",
    "isAbsolute": true,
    "upperCmd": "A",
    "values": [
      45,
      45,
      0,
      0,
      0,
      125,
      125,
    ],
  },
  {
    "cmd": "a",
    "isAbsolute": false,
    "upperCmd": "A",
    "values": [
      4.5,
      4.5,
      0,
      0,
      0,
      12.5,
      12.5,
    ],
  },
]
`);
	});
	test("can create collapsed flags ecliptical arc to", () => {
		expect(createPathItems("A 45 45, 0, 00125 125")).toMatchInlineSnapshot(`
[
  {
    "cmd": "A",
    "isAbsolute": true,
    "upperCmd": "A",
    "values": [
      45,
      45,
      0,
      0,
      0,
      125,
      125,
    ],
  },
]
`);
	});
	test("can create command group", () => {
		expect(createPathItems("M0 1 .2.3")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      0,
      1,
    ],
  },
  {
    "cmd": "L",
    "isAbsolute": true,
    "upperCmd": "L",
    "values": [
      0.2,
      0.3,
    ],
  },
]
`);
	});
	test("can create command group", () => {
		expect(
			createPathItems("A1 2 3 006 7 8 9 10 1013 14"),
		).toMatchInlineSnapshot(`
[
  {
    "cmd": "A",
    "isAbsolute": true,
    "upperCmd": "A",
    "values": [
      1,
      2,
      3,
      0,
      0,
      6,
      7,
    ],
  },
  {
    "cmd": "A",
    "isAbsolute": true,
    "upperCmd": "A",
    "values": [
      8,
      9,
      10,
      1,
      0,
      13,
      14,
    ],
  },
]
`);
	});
	test("tolerant to lacking value", () => {
		expect(createPathItems("M2")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "isAbsolute": true,
    "upperCmd": "M",
    "values": [
      2,
      0,
    ],
  },
]
`);
	});
	test("tolerant to lacking arc flags", () => {
		expect(createPathItems("A 45 45, 0, 215 125")).toMatchInlineSnapshot(`
[
  {
    "cmd": "A",
    "isAbsolute": true,
    "upperCmd": "A",
    "values": [
      45,
      45,
      0,
      0,
      0,
      215,
      125,
    ],
  },
]
`);
	});
});
