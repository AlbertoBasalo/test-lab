import assert from "node:assert";
import { test, describe, beforeEach, mock } from "node:test";
import { idUtils } from "../app/utils/id.utils.ts";
import { file } from "../app/file/file.adapter.ts";

describe("idUtils scenarios", () => {
  beforeEach(() => {
    mock.restoreAll();
    idUtils.file = file; // Resets the file adapter and internal seed/last values
  });

  describe("generate", () => {
    test("should return an ID starting with the stubbed seed when getSeed is stubbed", async () => {
      // Arrange
      const getSeedStub = mock.method(idUtils, "getSeed");
      getSeedStub.mock.mockImplementationOnce(async () => 100);
      // Act
      const id = await idUtils.generate();
      // Assert
      assert.ok(id.startsWith("100."), "ID should start with '100.'");
    });

    test("should return an ID with '.1' when getSeed is stubbed and it's the first call", async () => {
      // Arrange
      const getSeedStub = mock.method(idUtils, "getSeed");
      getSeedStub.mock.mockImplementationOnce(async () => 100);
      // Act
      const id = await idUtils.generate();
      // Assert
      assert.strictEqual(id, "100.1", "ID should be '100.1'");
    });

    test("should return the first ID as 'seed.1' when getSeed provides a consistent seed", async () => {
      // Arrange
      const getSeedStub = mock.method(idUtils, "getSeed");
      getSeedStub.mock.mockImplementation(async () => 200);
      // Act
      const id1 = await idUtils.generate();
      await idUtils.generate(); // Second call
      // Assert
      assert.strictEqual(id1, "200.1", "First ID should be '200.1'");
    });

    test("should return the second ID as 'seed.2' when getSeed provides a consistent seed", async () => {
      // Arrange
      const getSeedStub = mock.method(idUtils, "getSeed");
      getSeedStub.mock.mockImplementation(async () => 200);
      // Act
      await idUtils.generate(); // First call
      const id2 = await idUtils.generate(); // Second call
      // Assert
      assert.strictEqual(id2, "200.2", "Second ID should be '200.2'");
    });

    test("should update idUtils.last to 2 after two calls with a consistent seed", async () => {
      // Arrange
      const getSeedStub = mock.method(idUtils, "getSeed");
      getSeedStub.mock.mockImplementation(async () => 200);
      // Act
      await idUtils.generate();
      await idUtils.generate();
      // Assert
      assert.strictEqual(idUtils.last, 2, "idUtils.last should be 2");
    });
  });

  describe("extractSeed", () => {
    test("should correctly parse the seed number from a valid ID string", () => {
      // Arrange
      const id = "300.5";
      const expectedSeed = 300;
      // Act
      const actualSeed = idUtils.extractSeed(id);
      // Assert
      assert.strictEqual(actualSeed, expectedSeed, "Should extract 300 from '300.5'");
    });
  });

  describe("getSeed", () => {
    let fileAdapterMock: {
      exists: ReturnType<typeof mock.fn>;
      readJson: ReturnType<typeof mock.fn>;
      writeJson: ReturnType<typeof mock.fn>;
    };
    const fakeSeedFromFile = 50;
    const expectedSeedAfterIncrement = fakeSeedFromFile + 1;

    beforeEach(() => {
      fileAdapterMock = {
        exists: mock.fn(async (path: string) => path === "seed.json"),
        readJson: mock.fn(async (path: string) => {
          if (path === "seed.json") {
            return fakeSeedFromFile;
          }
          throw new Error("File not found for readJson mock");
        }),
        writeJson: mock.fn(async (path: string, data: unknown) => {
          if (path === "seed.json") {
            return Promise.resolve();
          }
          throw new Error("Path not allowed for writeJson mock");
        }),
      };
      // biome-ignore lint/suspicious/noExplicitAny: any for testing
      idUtils.file = fileAdapterMock as any;
    });

    test("should return the incremented seed after reading from file", async () => {
      // Act
      const actualSeed = await idUtils.getSeed();
      // Assert
      assert.strictEqual(actualSeed, expectedSeedAfterIncrement, `Should return ${expectedSeedAfterIncrement}`);
    });

    test("should call file.exists once with 'seed.json'", async () => {
      // Act
      await idUtils.getSeed();
      // Assert
      const calls = fileAdapterMock.exists.mock.calls;
      assert.strictEqual(calls.length, 1, "file.exists should be called once");
      assert.strictEqual(calls[0].arguments[0], "seed.json", "file.exists should be called with 'seed.json'");
    });

    test("should call file.readJson once with 'seed.json' if file exists", async () => {
      // Act
      await idUtils.getSeed();
      // Assert
      const calls = fileAdapterMock.readJson.mock.calls;
      assert.strictEqual(calls.length, 1, "file.readJson should be called once");
      assert.strictEqual(calls[0].arguments[0], "seed.json", "file.readJson should be called with 'seed.json'");
    });
    
    test("should call file.writeJson once with 'seed.json' and the incremented seed", async () => {
      // Act
      await idUtils.getSeed();
      // Assert
      const calls = fileAdapterMock.writeJson.mock.calls;
      assert.strictEqual(calls.length, 1, "file.writeJson should be called once");
      assert.strictEqual(calls[0].arguments[0], "seed.json", "file.writeJson should be called with 'seed.json'");
    });

    test("should call file.writeJson with the correctly incremented seed value", async () => {
      // Act
      await idUtils.getSeed();
      // Assert
      const calls = fileAdapterMock.writeJson.mock.calls;
      assert.strictEqual(calls[0].arguments[1], expectedSeedAfterIncrement, `file.writeJson should be called with ${expectedSeedAfterIncrement}`);
    });
  });
});
