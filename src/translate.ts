export function translateDiff(
	upperCmd: string,
	values: number[],
	dx: number,
	dy: number,
): void {
	switch (upperCmd) {
		case "H":
			values[0] += dx;
			break;
		case "V":
			values[0] += dy;
			break;
		case "A":
			values[5] += dx;
			values[6] += dy;
			break;
		case "Z":
			break;
		default:
			for (let i = 0; i < values.length; ) {
				values[i++] += dx;
				values[i++] += dy;
			}
	}
}
