import { file } from "../app/file/file.adapter.ts";
import { idUtils } from "../app/utils/id.utils.ts";

// Entry - Output

// 1 Deterministic tests

describe("idUtils", () => {
  describe("extractSeed", () => {
    it("should extract seed from id", () => {
      // Arrange
      const id = "1.2";
      const expectedSeed = 1;
      // Act
      const actualSeed = idUtils.extractSeed(id);
      // Assert
      expect(actualSeed).toBe(expectedSeed);
    });
  });

  // 2 Non-deterministic tests

  describe("generate", () => {
    it("should generate id with minimum length", async () => {
      // Arrange
      const expectedMinLength = 3;
      // Act
      const actualId = await idUtils.generate();
      // Assert
      expect(actualId.length).toBeGreaterThanOrEqual(expectedMinLength);
    });
  });

  // 3 State change tests

  describe("last", () => {
    it("should return last number from generated id", async () => {
      // Arrange
      const id = await idUtils.generate();
      const expectedLast = Number.parseInt(id.split(".")[1]);
      // Act
      const actualLast = idUtils.last;
      // Assert
      expect(actualLast).toBe(expectedLast);
    });
  });

  // 4 Effect tests

  describe("seedJson", () => {
    it("should match seed from generated id", async () => {
      // Arrange
      const id = await idUtils.generate();
      const expectedSeed = Number.parseInt(id.split(".")[0]);
      // Act
      const actualSeed = await file.readJson("seed.json");
      // Assert
      expect(actualSeed).toBe(expectedSeed);
    });
  });
});
