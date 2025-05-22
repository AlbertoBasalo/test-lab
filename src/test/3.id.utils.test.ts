import { idUtils } from "../app/utils/id.utils.ts";

// Suites pro.

describe("id utils", () => {
	let originalGetSeed: jest.Mock;
	beforeAll(() => {
		originalGetSeed = idUtils.getSeed as jest.Mock;
	});
	beforeEach(() => {
		idUtils.getSeed = originalGetSeed;
		jest.clearAllMocks();
	});
	describe("generate", () => {
		it("should generate id with stubbed getSeed", async () => {
			const getSeedStub = jest.fn().mockResolvedValueOnce(42);
			idUtils.getSeed = getSeedStub;
			const id = await idUtils.generate();
			const seed = idUtils.extractSeed(id);
			expect(seed).toBe(42);
		});
	});
	it("should call getSeed once", async () => {
		const getSeedSpy = jest.spyOn(idUtils, "getSeed");
		await idUtils.generate();
		expect(getSeedSpy).toHaveBeenCalledTimes(1);
	});
	it("should use fake file adapter", async () => {
		const fileAdapterFake = {
			readJson: jest.fn().mockResolvedValue(42),
			writeJson: jest.fn().mockResolvedValue(undefined),
			exists: jest.fn().mockResolvedValue(true),
		};
		// biome-ignore lint: any for testing
		idUtils.file = fileAdapterFake as any;
		const id = await idUtils.generate();
		const seed = idUtils.extractSeed(id);
		expect(seed).toBe(43);
	});
});
