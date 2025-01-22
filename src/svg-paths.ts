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
