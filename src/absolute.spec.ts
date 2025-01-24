import { describe, expect, test } from "bun:test";

import { makePathItemToAbsolute, makePathItemToRelative } from "./absolute.js";
import { createPathItems, toPathTextFromPathItems } from "./path-item.js";
import type { PathPoint } from "./point.js";

describe("makePathItemToAbsolute()", () => {
	test("can make from relative", () => {
		testMakePathItemToAbsolute("m0 0", [1, 2], "M1 2");
	});
	test("ignore from absolute", () => {
		testMakePathItemToAbsolute("M0 0", [1, 2], "M0 0");
	});
});

describe("makePathItemToRelative()", () => {
	test("can make from absolute", () => {
		testMakePathItemToRelative("M0 0", [1, 2], "m-1-2");
	});
	test("ignore from relative", () => {
		testMakePathItemToRelative("m0 0", [1, 2], "m0 0");
	});
});

function testMakePathItemToAbsolute(
	text: string,
	point: PathPoint,
	expected: string,
) {
	const [item] = createPathItems(text);
	const upperCmd = item.cmd.toUpperCase();
	makePathItemToAbsolute(item, upperCmd, item.cmd === upperCmd, point);
	expect(toPathTextFromPathItems([item])).toBe(expected);
}

function testMakePathItemToRelative(
	text: string,
	point: PathPoint,
	expected: string,
) {
	const [item] = createPathItems(text);
	const upperCmd = item.cmd.toUpperCase();
	makePathItemToRelative(item, upperCmd, item.cmd === upperCmd, point);
	expect(toPathTextFromPathItems([item])).toBe(expected);
}
