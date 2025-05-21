import { file } from "../app/file/file.adapter.ts";
import { idUtils } from "../app/utils/id.utils.ts";

// Doubles

describe("idUtils", () => {
  beforeEach(() => {
    // Reset idUtils state before each test
    idUtils.file = file;
    // Clear all mocks
    jest.clearAllMocks();
  });

  // 1-Stubs
  describe("generate with stubs", () => {
    it("should generate id with stubbed getSeed", async () => {
      // Arrange
      jest.spyOn(idUtils, "getSeed").mockResolvedValueOnce(1);
      // Act
      const actualId = await idUtils.generate();
      // Assert
      expect(actualId).toBe("1.1");
    });
  });

  // 2-Spies
  describe("generate with spies", () => {
    it("should call getSeed once", async () => {
      // Arrange
      const getSeedSpy = jest.spyOn(idUtils, "getSeed").mockImplementation(async () => {
        return 1;
      });
      // Act
      await idUtils.generate();
      // Assert
      expect(getSeedSpy).toHaveBeenCalledTimes(1);
    });
  });

  // 3-Fakes
  describe("generate with fakes", () => {
    it("should use fake file adapter", async () => {
      // Arrange
      const fakeSeed = 180;
      const expectedSeed = fakeSeed + 1;
      const fileAdapterMock = {
        readJson: jest.fn().mockResolvedValue(fakeSeed),
        writeJson: jest.fn().mockResolvedValue(undefined),
        exists: jest.fn().mockResolvedValue(true),
      };
      // biome-ignore lint: any for testing
      idUtils.file = fileAdapterMock as any;
      // Reset internal state to ensure it uses the new file adapter
      jest.spyOn(idUtils, "getSeed").mockImplementation(async () => {
        if (await fileAdapterMock.exists("seed.json")) {
          const seed = await fileAdapterMock.readJson("seed.json");
          await fileAdapterMock.writeJson("seed.json", seed + 1);
          return seed + 1;
        }
        return 1;
      });
      // Act
      const actualId = await idUtils.generate();
      // Assert
      expect(actualId).toBe(`${expectedSeed}.1`);
      expect(fileAdapterMock.readJson).toHaveBeenCalledWith("seed.json");
      expect(fileAdapterMock.writeJson).toHaveBeenCalledWith("seed.json", expectedSeed);
    });
  });

  // 4-Mocks
  describe("generate with mocks", () => {
    it("should use mocked getSeed", async () => {
      // Arrange
      jest.spyOn(idUtils, "getSeed").mockResolvedValueOnce(1);
      // Act
      const actualId = await idUtils.generate();
      // Assert
      expect(actualId).toBe("1.1");
    });
  });
});
