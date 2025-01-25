import { describe, test, expect } from "bun:test";

import { createPathItems } from "./path-item.js";
import { scaleItem } from "./scale.js";
import { toPathText } from "./path-text";

describe("scale()", () => {
	test("can scale", () => {
		testScale("M1 2", "M2 4");
		testScale("H1", "H2");
		testScale("V2", "V4");
		testScale("A1 2 0 006 7", "A4 2 90 0012 14");
	});
});

function testScale(text: string, expected: string): void {
	const [item] = createPathItems(text);
	expect(toPathText([scaleItem(item, 2)])).toBe(expected);
}
