import type { PathItem } from "./path-item.js";

export function translateDiff(
	item: PathItem,
	dx: number,
	dy: number,
): PathItem {
	const { upperCmd, values } = item;
	switch (upperCmd) {
		case "H":
			values[0] += dx;
			break;
		case "V":
			values[0] += dy;
			break;
		case "A":
			values[5] += dx;
			values[6] += dy;
			break;
		case "Z":
			break;
		default:
			for (let i = 0; i < values.length; ) {
				values[i++] += dx;
				values[i++] += dy;
			}
	}
	return item;
}
