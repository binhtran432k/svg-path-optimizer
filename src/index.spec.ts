import { describe, expect, test } from "bun:test";

import { optimize } from "./index.js";

describe("optimize()", () => {
	test("can optimize shorthands", () => {
		expect(optimize("C0 0 3 4 5 6")).toBe("S3 4 5 6");
		expect(optimize("C0 0 3 4 5 6C7 8 6 2 4 1")).toBe("S3 4 5 6 6 2 4 1");
		expect(optimize("Q0 0 1 2")).toBe("T1 2");
		expect(optimize("Q0 0 1 2Q2 4 2 1")).toBe("T1 2 2 1");
		expect(optimize("Q0 0 1 2C2 4 2 2 2 1")).toBe("T1 2C2 4 2 2 2 1");
	});
	test("can optimize shorthands with tolerance", () => {
		expect(optimize("C0 1 3 4 5 6")).toBe("C0 1 3 4 5 6");
		expect(optimize("C0 1 3 4 5 6", { tolerance: 1 })).toBe("S3 4 5 6");
	});
	test("can optimize lines", () => {
		expect(optimize("L0 3")).toBe("V3");
		expect(optimize("L2 0")).toBe("H2");
	});
	test("can optimize lines with tolerance", () => {
		expect(optimize("L1 3")).toBe("L1 3");
		expect(optimize("L0 1", { tolerance: 1 })).toBe("M0 0");
		expect(optimize("L1 3", { tolerance: 1 })).toBe("V3");
	});
	test("can optimize useless items", () => {
		expect(optimize("M0 0M2 3M1 3L2 1")).toBe("M1 3L2 1");
		expect(optimize("M1 3ZZZL2 1")).toBe("M1 3ZL2 1");
		expect(optimize("L2 1 2 1")).toBe("L2 1");
		expect(optimize("M3 0H3")).toBe("M3 0");
	});
	test("can optimize useless items with tolerance", () => {
		expect(optimize("M3 0H2")).toBe("M3 0H2");
		expect(optimize("M3 0H2", { tolerance: 1 })).toBe("M3 0");
	});
	test("can optimize useless items", () => {
		expect(optimize("M0 0M2 3M1 3L2 1")).toBe("M1 3L2 1");
		expect(optimize("M1 3ZZZL2 1")).toBe("M1 3ZL2 1");
		expect(optimize("L2 1 2 1")).toBe("L2 1");
	});
	test("can optimize trailing points", () => {
		expect(optimize("L1 2M2 3")).toBe("L1 2");
		expect(optimize("L1 2M2 3m4 5")).toBe("L1 2");
	});
	test("can optimize absolute or relative", () => {
		expect(optimize("M1 2l-1-2")).toBe("M1 2L0 0");
		expect(optimize("M1 2L10 10")).toBe("M1 2l9 8");
	});
});
