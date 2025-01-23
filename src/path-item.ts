export interface PathItem {
	cmd: string;
	values: number[];
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

export function createPathItems(pathText: string): PathItem[] {
	return splitPathText(pathText).flatMap(parsePathItems);
}

export function toPathTextFromPathItems(items: PathItem[]): string {
	let rt = "";
	let preCmd = "0";
	let preIsFloating = false;
	for (const { cmd, values } of items) {
		if (cmd !== preCmd) {
			rt += cmd;
		}
		const upperCmd = cmd.toUpperCase();
		// biome-ignore lint/style/noNonNullAssertion: cmd is valid from SvgPaths by default
		const size = SvgPathSizeMap.get(upperCmd)!;
		for (let i = 0; i < size; i++) {
			const v = values[i];
			const isFirstCmdGroupIdx = i === 0 && preCmd !== cmd;
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

function parsePathItems(pathItemsText: string): PathItem[] {
	const rt: PathItem[] = [];

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

	const allValueTexts: string[] = new Array(sizePerCmd * count);
	for (let i = 0, vI = 0; i < allValueTexts.length; ) {
		if (i % sizePerCmd === 3 && upperCmd === "A") {
			const flagText = valueTexts.slice(vI, vI + 3).join(" ");
			let flagI = 0;
			if ("01".includes(flagText[flagI])) {
				allValueTexts[i++] = flagText[flagI++];
				if (flagText[flagI] === " ") flagI++;
				if ("01".includes(flagText[flagI])) {
					allValueTexts[i++] = flagText[flagI++];
				} else {
					allValueTexts[i++] = "0";
				}
			} else {
				allValueTexts[i++] = "0";
				allValueTexts[i++] = "0";
			}
			for (const remainText of flagText
				.slice(flagI)
				.split(" ")
				.filter(Boolean)) {
				allValueTexts[i++] = remainText;
			}
			vI += 3;
		} else {
			allValueTexts[i++] = valueTexts[vI++] ?? "0";
		}
	}
	for (let i = 0; i < count; i++) {
		rt.push({
			cmd,
			values: allValueTexts
				.slice(sizePerCmd * i, sizePerCmd * (i + 1))
				.map(Number),
		});
	}
	return rt;
}
