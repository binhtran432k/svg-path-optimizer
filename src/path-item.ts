export interface PathItem {
	cmd: string;
	values: number[];
	upperCmd: string;
	isAbsolute: boolean;
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

function splitPathText(pathText: string): string[] {
	return pathText
		.trim()
		.split(/([a-zA-Z][,\.\-\s\d]*)/)
		.filter(Boolean);
}

function parsePathItems(pathItemsText: string): PathItem[] {
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
		sizePerCmd === 0 ? 0 : Math.ceil(valueTexts.length / sizePerCmd);

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

	const rt: PathItem[] = [
		{
			cmd,
			values: allValueTexts.slice(0, sizePerCmd).map(Number),
			upperCmd,
			isAbsolute: cmd === upperCmd,
		},
	];
	const groupCmd = cmd === "m" ? "l" : cmd === "M" ? "L" : cmd;
	for (let i = 1; i < count; i++) {
		const upperGroupCmd = groupCmd.toUpperCase();
		rt.push({
			cmd: groupCmd,
			values: allValueTexts
				.slice(sizePerCmd * i, sizePerCmd * (i + 1))
				.map(Number),
			upperCmd: upperGroupCmd,
			isAbsolute: groupCmd === upperGroupCmd,
		});
	}
	return rt;
}
