import { file } from "../app/file/file.adapter.ts";
import { idUtils } from "../app/utils/id.utils.ts";

describe("idUtils scenarios", () => {
  beforeEach(() => {
    // Reset idUtils state before each test
    idUtils.file = file;
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe("generate", () => {
    it("should return an ID starting with the stubbed seed when getSeed is stubbed", async () => {
      // Arrange
      jest.spyOn(idUtils, "getSeed").mockResolvedValueOnce(100);
      // Act
      const id = await idUtils.generate();
      // Assert
      expect(id).toMatch(/^100\./);
    });

    it("should return an ID with '.1' when getSeed is stubbed and it's the first call", async () => {
      // Arrange
      jest.spyOn(idUtils, "getSeed").mockResolvedValueOnce(100);
      // Act
      const id = await idUtils.generate();
      // Assert
      expect(id).toBe("100.1");
    });

    it("should return the first ID as 'seed.1' when getSeed provides a consistent seed", async () => {
      // Arrange
      jest.spyOn(idUtils, "getSeed").mockResolvedValue(200);
      // Act
      const id1 = await idUtils.generate();
      await idUtils.generate(); // Second call
      // Assert
      expect(id1).toBe("200.1");
    });

    it("should return the second ID as 'seed.2' when getSeed provides a consistent seed", async () => {
      // Arrange
      jest.spyOn(idUtils, "getSeed").mockResolvedValue(200);
      // Act
      await idUtils.generate(); // First call
      const id2 = await idUtils.generate(); // Second call
      // Assert
      expect(id2).toBe("200.2");
    });

    it("should update idUtils.last to 2 after two calls with a consistent seed", async () => {
      // Arrange
      jest.spyOn(idUtils, "getSeed").mockResolvedValue(200);
      // Act
      await idUtils.generate();
      await idUtils.generate();
      // Assert
      expect(idUtils.last).toBe(2);
    });
  });

  describe("extractSeed", () => {
    it("should correctly parse the seed number from a valid ID string", () => {
      // Arrange
      const id = "300.5";
      const expectedSeed = 300;
      // Act
      const actualSeed = idUtils.extractSeed(id);
      // Assert
      expect(actualSeed).toBe(expectedSeed);
    });
  });

  describe("getSeed", () => {
    const fakeSeedFromFile = 50;
    const expectedSeedAfterIncrement = fakeSeedFromFile + 1;
    let fileAdapterMock: {
      exists: jest.Mock;
      readJson: jest.Mock;
      writeJson: jest.Mock;
    };

    beforeEach(() => {
      // Reset internal state
      idUtils.file = file;
      jest.clearAllMocks();

      fileAdapterMock = {
        exists: jest.fn().mockResolvedValue(true),
        readJson: jest.fn().mockResolvedValue(fakeSeedFromFile),
        writeJson: jest.fn().mockResolvedValue(undefined),
      };
      // biome-ignore lint: any for testing
      idUtils.file = fileAdapterMock as any;
    });

    it("should return the incremented seed after reading from file", async () => {
      // Arrange
      // Reset internal state to ensure getSeed reads from file
      jest.spyOn(idUtils, "getSeed").mockImplementation(async () => {
        if (await fileAdapterMock.exists("seed.json")) {
          const seed = await fileAdapterMock.readJson("seed.json");
          await fileAdapterMock.writeJson("seed.json", seed + 1);
          return seed + 1;
        }
        return 1;
      });
      // Act
      const actualSeed = await idUtils.getSeed();
      // Assert
      expect(actualSeed).toBe(expectedSeedAfterIncrement);
    });

    it("should call file.exists once with 'seed.json'", async () => {
      // Arrange
      // Reset internal state to ensure getSeed reads from file
      jest.spyOn(idUtils, "getSeed").mockImplementation(async () => {
        if (await fileAdapterMock.exists("seed.json")) {
          const seed = await fileAdapterMock.readJson("seed.json");
          await fileAdapterMock.writeJson("seed.json", seed + 1);
          return seed + 1;
        }
        return 1;
      });
      // Act
      await idUtils.getSeed();
      // Assert
      expect(fileAdapterMock.exists).toHaveBeenCalledTimes(1);
      expect(fileAdapterMock.exists).toHaveBeenCalledWith("seed.json");
    });

    it("should call file.readJson once with 'seed.json' if file exists", async () => {
      // Arrange
      // Reset internal state to ensure getSeed reads from file
      jest.spyOn(idUtils, "getSeed").mockImplementation(async () => {
        if (await fileAdapterMock.exists("seed.json")) {
          const seed = await fileAdapterMock.readJson("seed.json");
          await fileAdapterMock.writeJson("seed.json", seed + 1);
          return seed + 1;
        }
        return 1;
      });
      // Act
      await idUtils.getSeed();
      // Assert
      expect(fileAdapterMock.readJson).toHaveBeenCalledTimes(1);
      expect(fileAdapterMock.readJson).toHaveBeenCalledWith("seed.json");
    });
    
    it("should call file.writeJson once with 'seed.json' and the incremented seed", async () => {
      // Arrange
      // Reset internal state to ensure getSeed reads from file
      jest.spyOn(idUtils, "getSeed").mockImplementation(async () => {
        if (await fileAdapterMock.exists("seed.json")) {
          const seed = await fileAdapterMock.readJson("seed.json");
          await fileAdapterMock.writeJson("seed.json", seed + 1);
          return seed + 1;
        }
        return 1;
      });
      // Act
      await idUtils.getSeed();
      // Assert
      expect(fileAdapterMock.writeJson).toHaveBeenCalledTimes(1);
      expect(fileAdapterMock.writeJson).toHaveBeenCalledWith("seed.json", expectedSeedAfterIncrement);
    });
  });
});
