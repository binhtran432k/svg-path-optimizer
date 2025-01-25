import type { PathItem } from "./path-item.js";
import { type PathPoint, toNextPoint } from "./point.js";
import { translateDiff } from "./translate.js";

export function toAbsolute(items: PathItem[]): PathItem[] {
	const startPoint: PathPoint = [0, 0];
	const point: PathPoint = [0, 0];
	for (const item of items) {
		const [x, y] = point;
		if (!item.isAbsolute) {
			translateDiff(item, x, y);
			item.cmd = item.upperCmd;
			item.isAbsolute = true;
		}
		toNextPoint(point, startPoint, item);
	}
	return items;
}

export function toRelativeItem(item: PathItem, [x, y]: PathPoint): PathItem {
	if (item.isAbsolute) {
		translateDiff(item, -x, -y);
		item.cmd = item.cmd.toLowerCase();
		item.isAbsolute = false;
	}
	return item;
}
