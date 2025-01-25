import { describe, expect, test } from "bun:test";

import { createPathItems } from "./path-item.js";
import { toPathText } from "./path-text.js";
import { translateDiff } from "./translate.js";

function testTranslate(text: string, dx: number, dy: number, expected: string) {
	const [item] = createPathItems(text);
	expect(toPathText([translateDiff(item, dx, dy)])).toBe(expected);
}

describe("translateDiff()", () => {
	test("can translate", () => {
		testTranslate("M0 0", 1, 2, "M1 2");
	});
	test("can translate honrizontal line", () => {
		testTranslate("H2", 1, 2, "H3");
	});
	test("can translate vertical line", () => {
		testTranslate("V2", 1, 2, "V4");
	});
	test("can translate arc", () => {
		testTranslate("A1 2 3 005 6", 1, 2, "A1 2 3 006 8");
	});
	test("can translate close path", () => {
		testTranslate("Z", 1, 2, "Z");
	});
});
