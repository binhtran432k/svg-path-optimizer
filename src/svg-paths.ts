export interface SvgPaths {
	cmds: string;
	valuesList: number[];
}

const SvgPathSizeMap: Map<string, number> = new Map(
	Object.entries({
		/** Move To */
		M: 2,
		/** Line To */
		L: 2,
		/** Horizontal Line To */
		H: 1,
		/** Vertical Line To */
		V: 1,
		/** Close Path */
		Z: 0,
		/** Curve To */
		C: 6,
		/** Short Curve To */
		S: 4,
		/** Quadratic Curve To */
		Q: 4,
		/** Short Quadratic Curve To */
		T: 2,
		/** Ecliptical Arc To */
		A: 7,
	}),
);

export function createSvgPaths(pathText: string): SvgPaths {
	const pathItems = splitPathText(pathText).flatMap(parsePathItems);
	return {
		cmds: pathItems.flatMap(([cmd]) => cmd).join(""),
		valuesList: pathItems.flatMap(([, values]) => values),
	};
}

export function toPathText(svgPaths: SvgPaths): string {
	let rt = "";
	let idx = 0;
	let preCmd = "0";
	let preIsFloating = false;
	for (const cmd of svgPaths.cmds) {
		if (cmd !== preCmd) {
			rt += cmd;
		}
		const upperCmd = cmd.toUpperCase();
		// biome-ignore lint/style/noNonNullAssertion: cmd is valid from SvgPaths by default
		const size = SvgPathSizeMap.get(upperCmd)!;
		for (let i = 0; i < size; i++) {
			const v = svgPaths.valuesList[idx + i];
			const isFirstCmdGroupIdx = i === 0 && preCmd !== cmd;
			const isNearZero = -1 < v && v < 1 && v !== 0;
			if (i === 3 && upperCmd === "A") {
				const flag2V = svgPaths.valuesList[idx + i + 1];
				rt += `${v}${flag2V}`;
				const postFlagV = svgPaths.valuesList[idx + i + 2];
				const isPostFlagNearZero =
					-1 < postFlagV && postFlagV < 1 && postFlagV !== 0;
				if (isPostFlagNearZero) {
					rt += postFlagV.toString().replace("0.", ".");
				} else {
					rt += postFlagV.toString();
				}
				i += 2;
				preIsFloating = Math.trunc(postFlagV) !== postFlagV;
				continue;
			}
			if (isNearZero) {
				if (!preIsFloating && !isFirstCmdGroupIdx) rt += " ";
				rt += v.toString().replace("0.", ".");
			} else if (v < 0 || isFirstCmdGroupIdx) {
				rt += v.toString();
			} else {
				rt += ` ${v.toString()}`;
			}
			preIsFloating = Math.trunc(v) !== v;
		}
		idx += size;
		preCmd = cmd;
	}
	return rt;
}

function splitPathText(pathText: string): string[] {
	return pathText
		.trim()
		.split(/([a-zA-Z][,\.\-\s\d]*)/)
		.filter(Boolean);
}

function parsePathItems(
	pathItemsText: string,
): [cmd: string, values: number[]][] {
	const rt: [cmd: string, values: number[]][] = [];

	const cmd = pathItemsText[0];
	const upperCmd = cmd.toUpperCase();

	const sizePerCmd = SvgPathSizeMap.get(upperCmd);
	if (sizePerCmd === undefined) return [];

	const valueTexts = pathItemsText
		.slice(1)
		.split(/\s*,\s*|\s+/)
		.flatMap((x) => x.split(/(-?\d+\.?\d*|-?\.\d+)/))
		.filter(Boolean);

	const count =
		sizePerCmd === 0 ? 1 : Math.ceil(valueTexts.length / sizePerCmd);

	for (let i = 0; i < count; i++) {
		const valuePerCmdTexts: string[] = [];
		for (let j = 0; j < sizePerCmd; j++) {
			const vI = i * sizePerCmd + j;
			if (j === 3 && upperCmd === "A") {
				const flags: string[] = [];
				const flagText = valueTexts.slice(vI, vI + 3).join(" ");

				let flagCount = 0;
				if ("01".includes(flagText[flagCount])) {
					flags.push(flagText[flagCount++]);
					if (flagText[flagCount] === " ") flagCount++;
					if ("01".includes(flagText[flagCount])) {
						flags.push(flagText[flagCount++]);
					} else {
						flags.push("0");
					}
				} else {
					flags.push("0");
					flags.push("0");
				}
				const remainFlagTexts = flagText
					.slice(flagCount)
					.split(" ")
					.filter(Boolean);

				valuePerCmdTexts.push(...flags, ...remainFlagTexts);
				j += flags.length + remainFlagTexts.length - 1;
			} else {
				valuePerCmdTexts.push(valueTexts[vI] ?? "0");
			}
		}
		rt.push([cmd, valuePerCmdTexts.slice(0, sizePerCmd).map(Number)]);
	}

	return rt;
}
