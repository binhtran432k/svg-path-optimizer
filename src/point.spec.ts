import { describe, test, expect } from "bun:test";
import { toNextPoint, type PathPoint } from "./point";
import { createPathItems } from "./path-item";

describe("toNextPoint()", () => {
	test("can make absolute", () => {
		testToNextPoint("M2 3", [1, 2], [2, 3]);
	});
	test("can make relative", () => {
		testToNextPoint("m2 3", [1, 2], [3, 5]);
	});
	test("can make horizontal", () => {
		testToNextPoint("H3", [1, 2], [3, 2]);
	});
	test("can make vertical", () => {
		testToNextPoint("V4", [1, 2], [1, 4]);
	});
	test("ignore close path", () => {
		testToNextPoint("Z", [1, 2], [1, 2]);
	});
});

function testToNextPoint(
	text: string,
	point: PathPoint,
	expectedPoint: PathPoint,
) {
	const [item] = createPathItems(text);
	toNextPoint(point, point, item);
	expect(point).toEqual(expectedPoint);
}
