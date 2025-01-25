import { describe, expect, test } from "bun:test";
import { toPathText } from "./path-text.js";
import { createPathItems } from "./path-item.js";

describe("toPathText()", () => {
	test("can convert", () => {
		testPathText("M0 0", "M0 0");
	});
	test("can convert negative", () => {
		testPathText("M0 -1", "M0-1");
	});
	test("can convert floating", () => {
		testPathText("M1 0.1", "M1 .1");
		testPathText("L0.1 0.1", "L.1.1");
		testPathText("L0.2 1.1", "L.2 1.1");
	});
	test("can convert command group", () => {
		testPathText("L1.2 0.1L0.3 0.4", "L1.2.1.3.4");
	});
	test("can convert arc to", () => {
		testPathText("A1 2 3 0 0 6 7", "A1 2 3 006 7");
	});
});

function testPathText(text: string, expected: string) {
	expect(toPathText(createPathItems(text))).toBe(expected);
}
