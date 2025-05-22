import { idUtils } from "../app/utils/id.utils.ts";

// Doubles

// 1-Stubs

test("generate should generate id with stubbed getSeed", async () => {
  // Arrange
  const inputSeed = 314;
  const getSeedStub = jest.fn().mockResolvedValueOnce(inputSeed);
  const originalGetSeed = idUtils.getSeed;
  idUtils.getSeed = getSeedStub;
  // Act
  const actualId = await idUtils.generate();
  const actualSeed = idUtils.extractSeed(actualId);
  // Assert
  expect(actualSeed).toBe(inputSeed);
  // After
  idUtils.getSeed = originalGetSeed; // restore getSeed implementation
});

// 2-Spies

test("getSeed should call getSeed once", async () => {
  // Arrange
  jest.clearAllMocks(); // restart counters
  const getSeedSpy = jest.spyOn(idUtils, "getSeed");
  // Act
  await idUtils.generate();
  // Assert
  expect(getSeedSpy).toHaveBeenCalledTimes(1);
});

// 3-Fakes

test("generate should use fake file adapter", async () => {
  // Arrange
  const fakeSeed = 314;
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


