import assert from "node:assert";
import { test } from "node:test";
import { idUtils } from "../app/utils/id.utils.ts";
import { file } from "../app/file/file.adapter.ts";

// Entry - Output

// 1 Deterministic tests

test("idUtils.extractSeed", () => {
  // Arrange
  const id = "1.2";
  const expectedSeed = 1;
  // Act
  const actualSeed = idUtils.extractSeed(id);
  // Assert
  assert.strictEqual(actualSeed, expectedSeed);
});

// 2 Non-deterministic tests

test("idUtils.generate", async () => {
  // Arrange
  const expectedMinLength = 3;
  // Act
  const actualId = await idUtils.generate();
  // Assert
  assert.ok(actualId.length >= expectedMinLength);
});

// 3 State change tests

test("idUtils.last", async () => {
  // Arrange
  const id = await idUtils.generate();
  const expectedLast = Number.parseInt(id.split(".")[1]);
  // Act
  const actualLast = idUtils.last;
  // Assert
  assert.strictEqual(actualLast, expectedLast);
});

// 4 Effect tests

test("idUtils.seedJson", async () => {
  // Arrange
  const id = await idUtils.generate();
  const expectedSeed = Number.parseInt(id.split(".")[0]);
  // Act
  const actualSeed = await file.readJson("seed.json");
  // Assert
  assert.strictEqual(actualSeed, expectedSeed);
});
