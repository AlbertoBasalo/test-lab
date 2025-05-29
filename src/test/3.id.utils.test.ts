import { idUtils } from "../app/utils/id.utils.ts";

// Suites pro.

describe("id utils", () => {
	const originalGetSeed: jest.Mock = idUtils.getSeed as jest.Mock;
	
	beforeEach(() => {
		idUtils.getSeed = originalGetSeed;
		jest.clearAllMocks();
	});
	describe("generate", () => {
		it("should generate id with stubbed getSeed", async () => { 
			const fakeReadSeed = 42;
			const stubGetSeed = jest.fn().mockResolvedValueOnce(fakeReadSeed);
			idUtils.getSeed = stubGetSeed;
			const id = await idUtils.generate();
			const seed = idUtils.extractSeed(id);
			expect(seed).toBe(fakeReadSeed);
		});
	});
	it("should call getSeed once", async () => {
		const spyGetSeed = jest.spyOn(idUtils, "getSeed");
		await idUtils.generate();
		expect(spyGetSeed).toHaveBeenCalledTimes(1);
	});
	it("should use fake file adapter", async () => {
    const fakeReadSeed = 42;
		const fakeFile = {
			readJson: jest.fn().mockResolvedValue(fakeReadSeed),
			writeJson: jest.fn().mockResolvedValue(undefined),
			exists: jest.fn().mockResolvedValue(true),
		};
		// biome-ignore lint: any for testing
		idUtils.file = fakeFile as any;
		const id = await idUtils.generate();
		const seed = idUtils.extractSeed(id);
    const expectedSeed = fakeReadSeed + 1;
		expect(seed).toBe(expectedSeed);
	});
});
