import type { PathItem } from "./path-item.js";

export interface PathTextState {
	preCmd: string;
	preIsFloating: boolean;
}

export function toPathText(items: PathItem[], fractionDigits?: number): string {
	let rt = "";
	const state: PathTextState = {
		preCmd: "0",
		preIsFloating: false,
	};
	for (const item of items) {
		rt += toPathTextItem(item, state, fractionDigits);
	}
	return rt;
}

export function toPathTextItem(
	{ cmd, values, upperCmd }: PathItem,
	state: PathTextState,
	fractionDigits = 4,
): string {
	let rt = "";
	const isInGroup = upperCmd !== "M" && cmd === state.preCmd;
	const isLineAfterMove =
		(cmd === "L" && state.preCmd === "M") ||
		(cmd === "l" && state.preCmd === "m");
	if (!isInGroup && !isLineAfterMove) {
		rt += cmd;
	}
	for (let i = 0; i < values.length; i++) {
		const v = formatNumber(values[i], fractionDigits);
		const isNearZero = /^-?\./.test(v);
		if (!isNearZero || !state.preIsFloating) {
			rt += " ";
		}
		if (i === 3 && upperCmd === "A") {
			const postFlagV = formatNumber(values[i + 2], fractionDigits);
			rt += `${v}${values[i + 1]}${postFlagV}`;
			i += 2;
			state.preIsFloating = postFlagV.includes(".");
			continue;
		}
		rt += v;
		state.preIsFloating = v.includes(".");
	}
	state.preCmd = cmd;
	return rt
		.replace(/^([a-z]) /i, "$1")
		.replace(/ -/g, "-")
		.replace(/(\.[0-9]+) (?=\.)/g, "$1");
}

function formatNumber(v: number, fractionDigits: number): string {
	return v
		.toFixed(fractionDigits)
		.replace(/^(-?[0-9]*\.([0-9]*[1-9])?)0*$/, "$1")
		.replace(/\.$/, "")
		.replace(/^(-?)0\./, "$1.");
}
