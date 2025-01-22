import { describe, expect, test } from "bun:test";
import { createSvgPaths } from "./svg-paths";

describe("createSvgPaths()", () => {
	test("can create", () => {
		expect(createSvgPaths("M0 0")).toEqual({
			cmds: "M",
			valuesList: [0, 0],
		});
	});
	test("can create negative", () => {
		expect(createSvgPaths("M-1-2")).toEqual({
			cmds: "M",
			valuesList: [-1, -2],
		});
	});
	test("can create float", () => {
		expect(createSvgPaths("M.1-.2")).toEqual({
			cmds: "M",
			valuesList: [0.1, -0.2],
		});
	});
	test("can create untrim", () => {
		expect(createSvgPaths("  M0 0  s  ")).toEqual({
			cmds: "M",
			valuesList: [0, 0],
		});
	});
	test("ignore invalid", () => {
		expect(createSvgPaths("b0 0")).toEqual({
			cmds: "",
			valuesList: [],
		});
	});
	test("can create move to", () => {
		expect(createSvgPaths("M0 1m10 20")).toEqual({
			cmds: "Mm",
			valuesList: [0, 1, 10, 20],
		});
	});
	test("can create line to", () => {
		expect(createSvgPaths("L0 1l10 20")).toEqual({
			cmds: "Ll",
			valuesList: [0, 1, 10, 20],
		});
	});
	test("can create horizontal line to", () => {
		expect(createSvgPaths("H0h10")).toEqual({
			cmds: "Hh",
			valuesList: [0, 10],
		});
	});
	test("can create vertical line to", () => {
		expect(createSvgPaths("V0v10")).toEqual({
			cmds: "Vv",
			valuesList: [0, 10],
		});
	});
	test("can create close path", () => {
		expect(createSvgPaths("Zz")).toEqual({
			cmds: "Zz",
			valuesList: [],
		});
	});
	test("can create curve to", () => {
		expect(createSvgPaths("C20 20, 40 20, 50 10c2 2, 4 2, 5 1")).toEqual({
			cmds: "Cc",
			valuesList: [20, 20, 40, 20, 50, 10, 2, 2, 4, 2, 5, 1],
		});
	});
	test("can create short curve to", () => {
		expect(createSvgPaths("S40 20, 50 10s4 2, 5 1")).toEqual({
			cmds: "Ss",
			valuesList: [40, 20, 50, 10, 4, 2, 5, 1],
		});
	});
	test("can create quadratic curve to", () => {
		expect(createSvgPaths("Q20 20, 50 10q2 2, 5 1")).toEqual({
			cmds: "Qq",
			valuesList: [20, 20, 50, 10, 2, 2, 5, 1],
		});
	});
	test("can create short quadratic curve to", () => {
		expect(createSvgPaths("T50 10t5 1")).toEqual({
			cmds: "Tt",
			valuesList: [50, 10, 5, 1],
		});
	});
	test("can create ecliptical arc to", () => {
		expect(
			createSvgPaths("A 45 45, 0, 0, 0, 125 125a4.5 4.5,0,0,0,12.5 12.5"),
		).toEqual({
			cmds: "Aa",
			valuesList: [45, 45, 0, 0, 0, 125, 125, 4.5, 4.5, 0, 0, 0, 12.5, 12.5],
		});
	});
	test("can create collapsed flags ecliptical arc to", () => {
		expect(createSvgPaths("A 45 45, 0, 00125 125")).toEqual({
			cmds: "A",
			valuesList: [45, 45, 0, 0, 0, 125, 125],
		});
	});
	test("can create command group", () => {
		expect(createSvgPaths("M0 1 .2.3")).toEqual({
			cmds: "MM",
			valuesList: [0, 1, 0.2, 0.3],
		});
	});
	test("tolerant to lacking value", () => {
		expect(createSvgPaths("M2")).toEqual({
			cmds: "M",
			valuesList: [2, 0],
		});
	});
	test("tolerant to lacking arc flags", () => {
		expect(createSvgPaths("A 45 45, 0, 215 125")).toEqual({
			cmds: "A",
			valuesList: [45, 45, 0, 0, 0, 215, 125],
		});
	});
});
