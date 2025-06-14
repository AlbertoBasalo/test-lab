import { idUtils } from '../app/utils/id.utils.ts';

// Doubles

// 1-Stubs
test('generate should generate id with stubbed getSeed', async () => {
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
  // restore getSeed implementation
  idUtils.getSeed = originalGetSeed;
});

// 2-Spies
test('getSeed should call getSeed once', async () => {
  // Arrange
  jest.clearAllMocks();
  const getSeedSpy = jest.spyOn(idUtils, 'getSeed');
  // Act
  await idUtils.generate();
  // Assert
  expect(getSeedSpy).toHaveBeenCalledTimes(1);
});

// 3-Fakes
test('generate should use fake file adapter', async () => {
  // Arrange
  jest.clearAllMocks();
  const fakeSeed = 314;
  const expectedSeed = fakeSeed + 1;
  const fileAdapterFake = {
    readJson: jest.fn().mockResolvedValue(fakeSeed),
    writeJson: jest.fn().mockResolvedValue(undefined),
    exists: jest.fn().mockResolvedValue(true),
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idUtils.file = fileAdapterFake as any;
  // Act
  const actualId = await idUtils.generate();
  const actualSeed = idUtils.extractSeed(actualId);
  // Assert
  expect(actualSeed).toBe(expectedSeed);
});
