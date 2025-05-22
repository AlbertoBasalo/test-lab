import { AssetsService } from "../../app/assets/assets.service";
import { RatesGateway } from "../../app/assets/rates.gateway";
import { file } from "../../app/file/file.adapter";

// Entry - Output

// 1 Deterministic tests

test("calculateValue should sum all assets values", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const assetsServiceSut = new AssetsService(ratesGateway);
  await assetsServiceSut.buildFor("user123", 1000);
  const expectedValue = 1000;
  // Act
  const actualValue = assetsServiceSut.calculateValue();
  // Assert
  expect(actualValue).toBe(expectedValue);
});

// 2 Non-deterministic tests

test("buy should add asset to portfolio or throw error", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const assetsServiceSut = new AssetsService(ratesGateway);
  await assetsServiceSut.buildFor("user123", 1000);
  // Act
  try {
    assetsServiceSut.buy("APPL", 100);
    // Assert
    const expectedAssetsLength = 2;
    expect(assetsServiceSut.portfolio.assets.length).toBe(expectedAssetsLength);
  } catch (error) {
    // Assert
    const expectedErrorMessage = "Not enough cash";
    const actualErrorMessage = (error as Error).message;
    expect(actualErrorMessage).toContain(expectedErrorMessage);
  }
});

// 3 State change tests

test("buildFor should create portfolio with USD asset", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const assetsServiceSut = new AssetsService(ratesGateway);
  // Act
  await assetsServiceSut.buildFor("user123", 1000);
  // Assert
  const actualAssets = assetsServiceSut.portfolio.assets;
  const expectedAssetsLength = 1;
  expect(actualAssets.length).toBe(expectedAssetsLength);
  // Could be improved in a suite of atomic tests
  const expectedAssetSymbol = "USD";
  expect(actualAssets[0].symbol).toBe(expectedAssetSymbol);
  const expectedAssetQuantity = 1000;
  expect(actualAssets[0].quantity).toBe(expectedAssetQuantity);
});

// 4 Effect tests

test("save should produce a file for the user", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const assetsServiceSut = new AssetsService(ratesGateway);
  await assetsServiceSut.buildFor("user123", 1000);
  // Act
  await assetsServiceSut.save();
  // Assert
  const expectedFileName = "portfolio-user123.json";
  const actualExists = await file.exists(expectedFileName);
  expect(actualExists).toBe(true);
});

