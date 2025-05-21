import { file } from "../app/file/file.adapter.ts";
import { idUtils } from "../app/utils/id.utils.ts";

// Entry - Output

// 1 Deterministic tests

test("extractSeed should extract seed from id", () => {
  // Arrange
  const inputId = "1.2";
  const expectedSeed = 1;
  // Act
  const actualSeed = idUtils.extractSeed(inputId);
  // Assert
  expect(actualSeed).toBe(expectedSeed);
});

// 2 Non-deterministic tests

test("generate should generate id with minimum length", async () => {
  // Arrange
  const expectedMinLength = 3;
  // Act
  const actualId = await idUtils.generate();
  const actualLength = actualId.length;
  // Assert
  expect(actualLength).toBeGreaterThanOrEqual(expectedMinLength);
});

// 3 State change tests

test("last should return a bigger last number after generating an id", async () => {
  // Arrange
  const expectedLast = idUtils.last;
  await idUtils.generate();
  // Act
  const actualLast = idUtils.last;
  // Assert
  expect(actualLast).toBeGreaterThan(expectedLast);
});
// 4 Effect tests

test("seedJson should match seed from generated id", async () => {
  // Arrange
  const id = await idUtils.generate();
  const expectedSeed = idUtils.extractSeed(id);
  // Act
  const actualSeed = await file.readJson("seed.json");
  // Assert
  expect(actualSeed).toBe(expectedSeed);
});
