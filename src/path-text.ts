import type { PathItem } from "./path-item.js";

export interface PathTextState {
	preCmd: string;
	preIsFloating: boolean;
}

export function toPathText(items: PathItem[]): string {
	let rt = "";
	const state: PathTextState = {
		preCmd: "0",
		preIsFloating: false,
	};
	for (const item of items) {
		rt += toPathTextItem(item, state);
	}
	return rt;
}

export function toPathTextItem(
	{ cmd, values, upperCmd }: PathItem,
	state: PathTextState,
): string {
	let rt = "";
	const isInGroup = upperCmd !== "M" && cmd === state.preCmd;
	if (!isInGroup) {
		rt += cmd;
	}
	for (let i = 0; i < values.length; i++) {
		const v = values[i];
		const isFirstCmdIdx = i === 0 && !isInGroup;
		const isNearZero = -1 < v && v < 1 && v !== 0;
		if (i === 3 && upperCmd === "A") {
			const flag2V = values[i + 1];
			rt += ` ${v}${flag2V}`;
			const postFlagV = values[i + 2];
			const isPostFlagNearZero =
				-1 < postFlagV && postFlagV < 1 && postFlagV !== 0;
			if (isPostFlagNearZero) {
				rt += postFlagV.toString().replace("0.", ".");
			} else {
				rt += postFlagV.toString();
			}
			i += 2;
			state.preIsFloating = Math.trunc(postFlagV) !== postFlagV;
			continue;
		}
		if (isNearZero) {
			if (!state.preIsFloating && !isFirstCmdIdx) rt += " ";
			rt += v.toString().replace("0.", ".");
		} else if (v < 0 || isFirstCmdIdx) {
			rt += v.toString();
		} else {
			rt += ` ${v.toString()}`;
		}
		state.preIsFloating = Math.trunc(v) !== v;
	}
	state.preCmd = cmd;
	return rt;
}
