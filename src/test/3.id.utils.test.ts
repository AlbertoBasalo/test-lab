import { idUtils } from "../app/utils/id.utils.ts";

// Suites

describe("id utils", () => {
  let originalGetSeed: jest.Mock;
  const fakeSeed = 314;
  beforeAll(() => {
    originalGetSeed = idUtils.getSeed as jest.Mock;
  });
  beforeEach(() => {
    idUtils.getSeed = originalGetSeed;
    jest.clearAllMocks();
  });
  describe("generate", () => {
    it("should generate id with stubbed getSeed", async () => {
      // Arrange
      const getSeedStub = jest.fn().mockResolvedValueOnce(fakeSeed);
      idUtils.getSeed = getSeedStub;
      // Act
      const actualId = await idUtils.generate();
      const actualSeed = idUtils.extractSeed(actualId);
      // Assert
      expect(actualSeed).toBe(fakeSeed);
    });
  });
  it("should call getSeed once", async () => {
    // Arrange
    const getSeedSpy = jest.spyOn(idUtils, "getSeed");
    // Act
    await idUtils.generate();
    // Assert
    expect(getSeedSpy).toHaveBeenCalledTimes(1);
  });
  it("should use fake file adapter", async () => {
    // Arrange
    const expectedSeed = fakeSeed + 1;
    const fileAdapterFake = {
      readJson: jest.fn().mockResolvedValue(fakeSeed),
      writeJson: jest.fn().mockResolvedValue(undefined),
      exists: jest.fn().mockResolvedValue(true),
    };
    // biome-ignore lint: any for testing
    idUtils.file = fileAdapterFake as any;
    // Act
    const actualId = await idUtils.generate();
    const actualSeed = idUtils.extractSeed(actualId);
    // Assert
    expect(actualSeed).toBe(expectedSeed);
  });
});
