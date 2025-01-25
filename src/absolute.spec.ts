import { describe, expect, test } from "bun:test";

import { toAbsolute, toRelativeItem } from "./absolute.js";
import { createPathItems } from "./path-item.js";
import { toPathText } from "./path-text.js";
import type { PathPoint } from "./point.js";

describe("toAbsolute()", () => {
	test("can convert relative", () => {
		testToAbsolute("M1 2l0 0", "M1 2L1 2");
	});
	test("ignore from absolute", () => {
		testToAbsolute("M1 2L0 0", "M1 2L0 0");
	});
});

describe("toRelativeItem()", () => {
	test("can clone from absolute", () => {
		testToRelativeItem("M0 0", [1, 2], "m-1-2");
	});
	test("ignore from relative", () => {
		testToRelativeItem("m0 0", [1, 2], "m0 0");
	});
});

function testToAbsolute(text: string, expected: string) {
	const absItems = toAbsolute(createPathItems(text));
	for (const item of absItems) {
		expect(item.cmd).toBe(item.upperCmd);
		expect(item.isAbsolute).toBeTrue();
	}
	expect(toPathText(absItems)).toBe(expected);
}

function testToRelativeItem(text: string, point: PathPoint, expected: string) {
	let [item] = createPathItems(text);
	item = toRelativeItem(item, point);
	expect(item.cmd).not.toBe(item.upperCmd);
	expect(item.isAbsolute).toBeFalse();
	expect(toPathText([item])).toBe(expected);
}
