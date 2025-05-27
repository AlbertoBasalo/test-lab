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
			const fakeReadSeed = 42;
			const getSeedStub = jest.fn().mockResolvedValueOnce(fakeReadSeed);
			idUtils.getSeed = getSeedStub;
			const id = await idUtils.generate();
			const seed = idUtils.extractSeed(id);
			expect(seed).toBe(fakeReadSeed);
		});
	});
	it("should call getSeed once", async () => {
		const getSeedSpy = jest.spyOn(idUtils, "getSeed");
		await idUtils.generate();
		expect(getSeedSpy).toHaveBeenCalledTimes(1);
	});
	it("should use fake file adapter", async () => {
    const fakeReadSeed = 42;
		const fileAdapterFake = {
			readJson: jest.fn().mockResolvedValue(fakeReadSeed),
			writeJson: jest.fn().mockResolvedValue(undefined),
			exists: jest.fn().mockResolvedValue(true),
		};
		// biome-ignore lint: any for testing
		idUtils.file = fileAdapterFake as any;
		const id = await idUtils.generate();
		const seed = idUtils.extractSeed(id);
    const expectedSeed = fakeReadSeed + 1;
		expect(seed).toBe(expectedSeed);
	});
});
