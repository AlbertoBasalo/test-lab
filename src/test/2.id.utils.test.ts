import { test } from "node:test";
import assert from 'node:assert';
import { mock } from 'node:test';
import { idUtils } from "../app/utils/id.utils.ts";
import { file } from "../app/file/file.adapter.ts";

// Doubles

// 1-Stubs

test("idUtils.generate stubbed getSeed", async () => {
  // Arrange
  const getSeedStub = mock.method(idUtils, "getSeed");
  getSeedStub.mock.mockImplementationOnce(async () => 1);
  // Act
  const actualId = await idUtils.generate();
  // Assert
  assert.strictEqual(actualId, "1.1"); 
});

// 2-Spies

test("idUtils.getSeed is called once", async () => {
  // Arrange
  const getSeedSpy = mock.method(idUtils, "getSeed");
  // Act
  await idUtils.generate();
  // Assert
  const actualCalls = getSeedSpy.mock.calls.length;
  assert.strictEqual(actualCalls, 1);
});

// 3-Fakes

// a fake file adapter to simulate read/write seed file

test("idUtils.getSeed mocks file adapter", async () => {
  // Arrange
  const fakeSeed = 180;
  const expectedSeed = fakeSeed + 1;
  const fileAdapterMock = {
    // biome-ignore lint: any for testing
    readJson: async () => Promise.resolve<any>(fakeSeed),
    writeJson: async () => Promise.resolve(),
    exists: async () => Promise.resolve(true),
  }
  // biome-ignore lint: any for testing
  idUtils.file = fileAdapterMock as any;
  // Act
  const actualId = await idUtils.generate();
  // Assert
  assert.strictEqual(actualId, `${expectedSeed}.1`);
});


// 4-Mocks

// Mock the getSeed method to return a specific seed value

test("idUtils.getSeed mocks getSeed", async () => {
  // Arrange
  const getSeedMock = mock.method(idUtils, "getSeed");
  getSeedMock.mock.mockImplementationOnce(async () => 1);
});
