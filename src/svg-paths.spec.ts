import { describe, expect, test } from "bun:test";
import { createSvgPaths, toPathText } from "./svg-paths";

describe("createSvgPaths()", () => {
	test("can create", () => {
		expect(createSvgPaths("M0 0")).toEqual({
			cmds: "M",
			values: [0, 0],
		});
	});
	test("can create negative", () => {
		expect(createSvgPaths("M-1-2")).toEqual({
			cmds: "M",
			values: [-1, -2],
		});
	});
	test("can create float", () => {
		expect(createSvgPaths("M.1-.2")).toEqual({
			cmds: "M",
			values: [0.1, -0.2],
		});
	});
	test("can create untrim", () => {
		expect(createSvgPaths("  M0 0  s  ")).toEqual({
			cmds: "M",
			values: [0, 0],
		});
	});
	test("ignore invalid", () => {
		expect(createSvgPaths("b0 0")).toEqual({
			cmds: "",
			values: [],
		});
	});
	test("can create move to", () => {
		expect(createSvgPaths("M0 1m10 20")).toEqual({
			cmds: "Mm",
			values: [0, 1, 10, 20],
		});
	});
	test("can create line to", () => {
		expect(createSvgPaths("L0 1l10 20")).toEqual({
			cmds: "Ll",
			values: [0, 1, 10, 20],
		});
	});
	test("can create horizontal line to", () => {
		expect(createSvgPaths("H0h10")).toEqual({
			cmds: "Hh",
			values: [0, 10],
		});
	});
	test("can create vertical line to", () => {
		expect(createSvgPaths("V0v10")).toEqual({
			cmds: "Vv",
			values: [0, 10],
		});
	});
	test("can create close path", () => {
		expect(createSvgPaths("Zz")).toEqual({
			cmds: "Zz",
			values: [],
		});
	});
	test("can create curve to", () => {
		expect(createSvgPaths("C20 20, 40 20, 50 10c2 2, 4 2, 5 1")).toEqual({
			cmds: "Cc",
			values: [20, 20, 40, 20, 50, 10, 2, 2, 4, 2, 5, 1],
		});
	});
	test("can create short curve to", () => {
		expect(createSvgPaths("S40 20, 50 10s4 2, 5 1")).toEqual({
			cmds: "Ss",
			values: [40, 20, 50, 10, 4, 2, 5, 1],
		});
	});
	test("can create quadratic curve to", () => {
		expect(createSvgPaths("Q20 20, 50 10q2 2, 5 1")).toEqual({
			cmds: "Qq",
			values: [20, 20, 50, 10, 2, 2, 5, 1],
		});
	});
	test("can create short quadratic curve to", () => {
		expect(createSvgPaths("T50 10t5 1")).toEqual({
			cmds: "Tt",
			values: [50, 10, 5, 1],
		});
	});
	test("can create ecliptical arc to", () => {
		expect(
			createSvgPaths("A 45 45, 0, 0, 0, 125 125a4.5 4.5,0,0,0,12.5 12.5"),
		).toEqual({
			cmds: "Aa",
			values: [45, 45, 0, 0, 0, 125, 125, 4.5, 4.5, 0, 0, 0, 12.5, 12.5],
		});
	});
	test("can create collapsed flags ecliptical arc to", () => {
		expect(createSvgPaths("A 45 45, 0, 00125 125")).toEqual({
			cmds: "A",
			values: [45, 45, 0, 0, 0, 125, 125],
		});
	});
	test("can create command group", () => {
		expect(createSvgPaths("M0 1 .2.3")).toEqual({
			cmds: "MM",
			values: [0, 1, 0.2, 0.3],
		});
	});
	test("tolerant to lacking value", () => {
		expect(createSvgPaths("M2")).toEqual({
			cmds: "M",
			values: [2, 0],
		});
	});
	test("tolerant to lacking arc flags", () => {
		expect(createSvgPaths("A 45 45, 0, 215 125")).toEqual({
			cmds: "A",
			values: [45, 45, 0, 0, 0, 215, 125],
		});
	});
});

describe("toPathText()", () => {
	test("can convert", () => {
		expect(
			toPathText({
				cmds: "M",
				values: [0, 0],
			}),
		).toBe("M0 0");
	});
	test("can convert negative", () => {
		expect(
			toPathText({
				cmds: "M",
				values: [0, -1],
			}),
		).toBe("M0-1");
	});
	test("can convert floating", () => {
		expect(
			toPathText({
				cmds: "M",
				values: [1, 0.1],
			}),
		).toBe("M1 .1");
		expect(
			toPathText({
				cmds: "M",
				values: [0.1, 0.1],
			}),
		).toBe("M.1.1");
		expect(
			toPathText({
				cmds: "M",
				values: [0.2, 1.1],
			}),
		).toBe("M.2 1.1");
	});
	test("can convert command group", () => {
		expect(
			toPathText({
				cmds: "MM",
				values: [1.2, 0.1, 0.3, 0.4],
			}),
		).toBe("M1.2.1.3.4");
	});
	test("can convert arc to", () => {
		expect(
			toPathText({
				cmds: "A",
				values: [1, 2, 3, 0, 0, 6, 7],
			}),
		).toBe("A1 2 3 006 7");
	});
});
