import type { PathItem } from "./path-item.js";

export function scaleItem(item: PathItem, ratio: number): PathItem {
	const { upperCmd, values } = item;
	switch (upperCmd) {
		case "H":
			values[0] *= ratio;
			break;
		case "V":
			values[0] *= ratio;
			break;
		case "A":
			scaleArc(values, ratio, ratio);
			break;
		case "Z":
			break;
		default:
			for (let i = 0; i < values.length; ) {
				values[i++] *= ratio;
				values[i++] *= ratio;
			}
	}
	return item;
}

function scaleArc(values: number[], kx: number, ky: number) {
	const a = values[0];
	const b = values[1];
	const angle = (Math.PI * values[2]) / 180.0;
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	const A = b * b * ky * ky * cos * cos + a * a * ky * ky * sin * sin;
	const B = 2 * kx * ky * cos * sin * (b * b - a * a);
	const C = a * a * kx * kx * cos * cos + b * b * kx * kx * sin * sin;
	const F = -(a * a * b * b * kx * kx * ky * ky);
	const det = B * B - 4 * A * C;
	const val1 = Math.sqrt((A - C) * (A - C) + B * B);

	// New rotation:
	values[2] =
		B !== 0 ? (Math.atan((C - A - val1) / B) * 180) / Math.PI : A < C ? 0 : 90;

	// New radius-x, radius-y
	if (det !== 0) {
		values[0] = -Math.sqrt(2 * det * F * (A + C + val1)) / det;
		values[1] = -Math.sqrt(2 * det * F * (A + C - val1)) / det;
	}

	// New target
	values[5] *= kx;
	values[6] *= ky;

	// New sweep flag
	values[4] = kx * ky >= 0 ? values[4] : 1 - values[4];
}
