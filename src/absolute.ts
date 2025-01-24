import type { PathItem } from "./path-item.js";
import type { PathPoint } from "./point.js";
import { translateDiff } from "./translate.js";

export function makePathItemToAbsolute(
	item: PathItem,
	upperCmd: string,
	isAbsolute: boolean,
	[x, y]: PathPoint,
): void {
	if (!isAbsolute) {
		translateDiff(upperCmd, item.values, x, y);
		item.cmd = upperCmd;
	}
}

export function makePathItemToRelative(
	item: PathItem,
	upperCmd: string,
	isAbsolute: boolean,
	[x, y]: PathPoint,
): void {
	if (isAbsolute) {
		translateDiff(upperCmd, item.values, -x, -y);
		item.cmd = item.cmd.toLowerCase();
	}
}
