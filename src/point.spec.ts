import { describe, test, expect } from "bun:test";
import { makeToNextPoint, type PathPoint } from "./point";
import { createPathItems } from "./path-item";

describe("makeToNextPoint()", () => {
	test("can make absolute", () => {
		testMakeToNextPoint("M2 3", [1, 2], [2, 3]);
	});
	test("can make relative", () => {
		testMakeToNextPoint("m2 3", [1, 2], [3, 5]);
	});
	test("can make horizontal", () => {
		testMakeToNextPoint("H3", [1, 2], [3, 2]);
	});
	test("can make vertical", () => {
		testMakeToNextPoint("V4", [1, 2], [1, 4]);
	});
	test("ignore close path", () => {
		testMakeToNextPoint("Z", [1, 2], [1, 2]);
	});
});

function testMakeToNextPoint(
	text: string,
	point: PathPoint,
	expectedPoint: PathPoint,
) {
	const [item] = createPathItems(text);
	const upperCmd = item.cmd.toUpperCase();
	makeToNextPoint(upperCmd, item.values, item.cmd === upperCmd, point);
	expect(point).toEqual(expectedPoint);
}
