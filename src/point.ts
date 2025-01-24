export type PathPoint = [x: number, y: number];

export function makeToNextPoint(
	upperCmd: string,
	values: number[],
	isAbsolute: boolean,
	point: PathPoint,
): void {
	const [initX, initY] = isAbsolute ? [0, 0] : point;
	switch (upperCmd) {
		case "H":
			point[0] = initX + values[0];
			break;
		case "V":
			point[1] = initY + values[0];
			break;
		case "Z":
			break;
		default:
			point[0] = initX + values[values.length - 2];
			point[1] = initY + values[values.length - 1];
	}
}
