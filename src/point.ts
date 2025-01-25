import type { PathItem } from "./path-item.js";

export type PathPoint = [x: number, y: number];

export function toNextPoint(
	point: PathPoint,
	startPoint: PathPoint,
	{ isAbsolute, values, upperCmd }: PathItem,
): PathPoint {
	const [initX, initY] = isAbsolute ? [0, 0] : point;
	switch (upperCmd) {
		case "H":
			point[0] = initX + values[0];
			break;
		case "V":
			point[1] = initY + values[0];
			break;
		case "Z":
			point[0] = startPoint[0];
			point[1] = startPoint[1];
			break;
		default:
			point[0] = initX + values[values.length - 2];
			point[1] = initY + values[values.length - 1];
	}
	if (upperCmd === "M") {
		startPoint[0] = point[0];
		startPoint[1] = point[1];
	}
	return point;
}

export function toNextControlPoint(
	ctrlPoint: PathPoint,
	[fx, fy]: PathPoint,
	[x, y]: PathPoint,
): PathPoint {
	ctrlPoint[0] = x + x - fx;
	ctrlPoint[1] = y + y - fy;
	return ctrlPoint;
}
