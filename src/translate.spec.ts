import { describe, expect, test } from "bun:test";

import { createSvgPaths, toPathText } from "./svg-paths.js";
import { translate } from "./translate.js";

describe("translate()", () => {
	test("can translate", () => {
		expect(toPathText(translate(createSvgPaths("M0 0"), 1, 2))).toBe("M1 2");
	});
	test("can translate honrizontal line", () => {
		expect(toPathText(translate(createSvgPaths("H2"), 1, 2))).toBe("H3");
	});
	test("can translate vertical line", () => {
		expect(toPathText(translate(createSvgPaths("V2"), 1, 2))).toBe("V4");
	});
	test("can translate arc", () => {
		expect(toPathText(translate(createSvgPaths("A1 2 3 005 6"), 1, 2))).toBe(
			"A1 2 3 006 8",
		);
	});
	test("can translate multiple", () => {
		expect(toPathText(translate(createSvgPaths("M0 0L3 4"), 1, 2))).toBe(
			"M1 2L4 6",
		);
	});
	test("can translate group", () => {
		expect(toPathText(translate(createSvgPaths("M0 0 3 4"), 1, 2))).toBe(
			"M1 2 4 6",
		);
	});
	test("ignore translate relative", () => {
		expect(toPathText(translate(createSvgPaths("m0 0"), 1, 2))).toBe("m0 0");
	});
});
