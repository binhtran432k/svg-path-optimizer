import { toAbsolute, toRelativeItem } from "./absolute.js";
import { type PathItem, createPathItems } from "./path-item.js";
import { type PathTextState, toPathText, toPathTextItem } from "./path-text.js";
import { type PathPoint, toNextControlPoint, toNextPoint } from "./point.js";
import { scaleItem } from "./scale.js";

export interface OptimizeOpts {
	scaleRatio?: number;
	/** @default 4 */
	fractionDigits: number;
	/** @default 0 */
	tolerance: number;
}

const DEAFULT_OPTS: OptimizeOpts = {
	fractionDigits: 4,
	tolerance: 0,
};

export function optimize(input: string, opts?: Partial<OptimizeOpts>): string {
	const o: OptimizeOpts = {
		...DEAFULT_OPTS,
		...opts,
	};

	let items = createPathItems(input);
	items = toAbsolute(items);
	if (o.scaleRatio) {
		for (const item of items) {
			scaleItem(item, o.scaleRatio);
		}
	}
	items = optimizeShorthands(items, o.tolerance);
	items = optimizeLines(items, o.tolerance);
	items = removeUselessItems(items, o.tolerance);
	items = trimTrailingPoint(items);
	items = optimizeAbsoluteRelative(items, o.fractionDigits);
	return toPathText(items, o.fractionDigits);
}

function optimizeShorthands(
	absItems: PathItem[],
	tolerance: number,
): PathItem[] {
	const startPoint: PathPoint = [0, 0];
	const point: PathPoint = [0, 0];
	const ctrlPoint: PathPoint = [0, 0];
	let preUpperCmd = "0";
	for (const item of absItems) {
		if (item.upperCmd === "Q") {
			const [ctrlX, ctrlY] = "QT".includes(preUpperCmd) ? ctrlPoint : point;
			const isSameCtrlX = Math.abs(ctrlX - item.values[0]) <= tolerance;
			const isSameCtrlY = Math.abs(ctrlY - item.values[1]) <= tolerance;
			if (isSameCtrlX && isSameCtrlY) {
				item.cmd = item.upperCmd = "T";
				item.values = item.values.slice(2);
			}
		} else if (item.upperCmd === "C") {
			const [ctrlX, ctrlY] = "CS".includes(preUpperCmd) ? ctrlPoint : point;
			const isSameCtrlX = Math.abs(ctrlX - item.values[0]) <= tolerance;
			const isSameCtrlY = Math.abs(ctrlY - item.values[1]) <= tolerance;
			if (isSameCtrlX && isSameCtrlY) {
				item.cmd = item.upperCmd = "S";
				item.values = item.values.slice(2);
			}
		}

		toNextPoint(point, startPoint, item);
		if ("QT".includes(item.upperCmd)) {
			toNextControlPoint(ctrlPoint, ctrlPoint, point);
		} else if (item.upperCmd === "C") {
			toNextControlPoint(ctrlPoint, [item.values[2], item.values[3]], point);
		} else if (item.upperCmd === "S") {
			toNextControlPoint(ctrlPoint, [item.values[0], item.values[1]], point);
		} else {
			ctrlPoint[0] = point[0];
			ctrlPoint[1] = point[1];
		}

		preUpperCmd = item.upperCmd;
	}
	return absItems;
}

function optimizeLines(items: PathItem[], tolerance: number): PathItem[] {
	const startPoint: PathPoint = [0, 0];
	const point: PathPoint = [0, 0];
	for (const item of items) {
		const [preX, preY] = point;
		toNextPoint(point, startPoint, item);

		if (item.upperCmd === "L") {
			const isSameX = Math.abs(point[0] - preX) <= tolerance;
			const isSameY = Math.abs(point[1] - preY) <= tolerance;
			if (isSameX && isSameY) {
				item.upperCmd = "M";
				item.values = [preX, preY];
			} else if (isSameX) {
				item.upperCmd = "V";
				item.values = [item.values[1]];
			} else if (isSameY) {
				item.upperCmd = "H";
				item.values = [item.values[0]];
			}
			item.cmd = item.isAbsolute ? item.upperCmd : item.upperCmd.toLowerCase();
		}
	}
	return items;
}

function removeUselessItems(items: PathItem[], tolerance: number): PathItem[] {
	if (items.length === 0) return [];

	const startPoint: PathPoint = [0, 0];
	const point: PathPoint = [0, 0];
	toNextPoint(point, startPoint, items[0]);

	const selectedItems: PathItem[] = [items[0]];

	for (let i = 1; i < items.length; i++) {
		const preItem = items[i - 1];
		const item = items[i];
		const [preX, preY]: PathPoint = [...point];
		toNextPoint(point, startPoint, item);

		if (item.upperCmd === preItem.upperCmd && "MZ".includes(item.upperCmd)) {
			selectedItems.pop();
		} else if (
			((item.upperCmd === "M" && preItem.upperCmd === "Z") ||
				"LVH".includes(item.upperCmd)) &&
			Math.abs(point[0] - preX) <= tolerance &&
			Math.abs(point[1] - preY) <= tolerance
		) {
			point[0] = preX;
			point[1] = preY;
			continue;
		}

		selectedItems.push(item);
	}
	return selectedItems;
}

function trimTrailingPoint(items: PathItem[]): PathItem[] {
	for (let i = items.length - 1; i > 0 && items[i].upperCmd === "M"; i--) {
		items.pop();
	}
	return items;
}

function optimizeAbsoluteRelative(
	absItems: PathItem[],
	fractionDigits?: number,
): PathItem[] {
	const state: PathTextState = {
		preCmd: "0",
		preIsFloating: false,
	};
	const startPoint: PathPoint = [0, 0];
	const point: PathPoint = [0, 0];
	for (const item of absItems) {
		const relState: PathTextState = { ...state };
		const relItem = toRelativeItem(
			{ ...item, values: item.values.slice() },
			point,
		);

		const relSize = toPathTextItem(relItem, relState, fractionDigits).length;
		const absSize = toPathTextItem(item, state, fractionDigits).length;

		if (relSize < absSize) {
			item.cmd = relItem.cmd;
			item.values = relItem.values;
			item.isAbsolute = relItem.isAbsolute;
			item.upperCmd = relItem.upperCmd;

			state.preCmd = relState.preCmd;
			state.preIsFloating = relState.preIsFloating;
		}

		toNextPoint(point, startPoint, item);
	}
	return absItems;
}
