import { describe, expect, test } from "bun:test";

import { createPathItems, toPathTextFromPathItems } from "./path-item.js";

describe("createSvgItems()", () => {
	test("can create", () => {
		expect(createPathItems("M0 0")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "values": [
      0,
      0,
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
    "values": [
      0.1,
      -0.2,
    ],
  },
]
`);
	});
	test("can create untrim", () => {
		expect(createPathItems("  M0 0  s  ")).toMatchInlineSnapshot(`
[
  {
    "cmd": "M",
    "values": [
      0,
      0,
    ],
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
    "values": [
      0,
      1,
    ],
  },
  {
    "cmd": "m",
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
    "values": [
      0,
      1,
    ],
  },
  {
    "cmd": "l",
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
    "values": [
      0,
    ],
  },
  {
    "cmd": "h",
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
    "values": [
      0,
    ],
  },
  {
    "cmd": "v",
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
    "values": [],
  },
  {
    "cmd": "z",
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
    "values": [
      40,
      20,
      50,
      10,
    ],
  },
  {
    "cmd": "s",
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
    "values": [
      20,
      20,
      50,
      10,
    ],
  },
  {
    "cmd": "q",
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
    "values": [
      50,
      10,
    ],
  },
  {
    "cmd": "t",
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
    "values": [
      0,
      1,
    ],
  },
  {
    "cmd": "M",
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

describe("toPathTextFromSvgItems()", () => {
	test("can convert", () => {
		expect(toPathTextFromPathItems([{ cmd: "M", values: [0, 0] }])).toBe(
			"M0 0",
		);
	});
	test("can convert negative", () => {
		expect(toPathTextFromPathItems([{ cmd: "M", values: [0, -1] }])).toBe(
			"M0-1",
		);
	});
	test("can convert floating", () => {
		expect(toPathTextFromPathItems([{ cmd: "M", values: [1, 0.1] }])).toBe(
			"M1 .1",
		);
		expect(toPathTextFromPathItems([{ cmd: "M", values: [0.1, 0.1] }])).toBe(
			"M.1.1",
		);
		expect(
			toPathTextFromPathItems([
				{
					cmd: "M",
					values: [0.2, 1.1],
				},
			]),
		).toBe("M.2 1.1");
	});
	test("can convert command group", () => {
		expect(
			toPathTextFromPathItems([
				{ cmd: "M", values: [1.2, 0.1] },
				{ cmd: "M", values: [0.3, 0.4] },
			]),
		).toBe("M1.2.1.3.4");
	});
	test("can convert arc to", () => {
		expect(
			toPathTextFromPathItems([{ cmd: "A", values: [1, 2, 3, 0, 0, 6, 7] }]),
		).toBe("A1 2 3 006 7");
	});
});
