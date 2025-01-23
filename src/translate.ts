export function translateDiff(
	upperCmd: string,
	values: number[],
	dx: number,
	dy: number,
): void {
	if (upperCmd === "H") {
		values[0] += dx;
	} else if (upperCmd === "V") {
		values[0] += dy;
	} else if (upperCmd === "A") {
		values[5] += dx;
		values[6] += dy;
	} else if (upperCmd !== "Z") {
		for (let i = 0; i < values.length; ) {
			values[i++] += dx;
			values[i++] += dy;
		}
	}
}
