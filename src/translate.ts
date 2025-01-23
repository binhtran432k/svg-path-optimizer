import { SvgPathSizeMap, type SvgPaths } from "./svg-paths.js";

export function translateDiff(
	svgPaths: SvgPaths,
	dx: number,
	dy: number,
): SvgPaths {
	let walkIdx = 0;
	for (const cmd of svgPaths.cmds) {
		const upperCmd = cmd.toUpperCase();
		const isAbsolute = cmd === upperCmd;

		// biome-ignore lint/style/noNonNullAssertion:
		const size = SvgPathSizeMap.get(upperCmd)!;
		if (isAbsolute) {
			walkIdx = translateCmdDiff(svgPaths, upperCmd, size, walkIdx, dx, dy);
		} else {
			walkIdx += size;
		}
	}
	return svgPaths;
}

export function translateCmdDiff(
	svgPaths: SvgPaths,
	upperCmd: string,
	size: number,
	idx: number,
	dx: number,
	dy: number,
): number {
	if (upperCmd === "H") {
		svgPaths.values[idx] += dx;
	} else if (upperCmd === "V") {
		svgPaths.values[idx] += dy;
	} else if (upperCmd === "A") {
		svgPaths.values[idx + 5] += dx;
		svgPaths.values[idx + 6] += dy;
	} else {
		for (let i = 0; i < size; i += 2) {
			svgPaths.values[idx + i] += dx;
			svgPaths.values[idx + i + 1] += dy;
		}
	}
	return idx + size;
}
