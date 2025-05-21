import { AssetsService } from "../../app/assets/assets.service";
import { RatesGateway } from "../../app/assets/rates.gateway";
import { file } from "../../app/file/file.adapter";

// Entry - Output

// 1 Deterministic tests

test("calculateValue should sum all assets values", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const service = new AssetsService(ratesGateway);
  await service.buildFor("user123", 1000);
  const expectedValue = 1000;
  // Act
  const actualValue = service.calculateValue();
  // Assert
  expect(actualValue).toBe(expectedValue);
});

// 2 Non-deterministic tests

test("buy should add asset to portfolio or throw error", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const service = new AssetsService(ratesGateway);
  await service.buildFor("user123", 1000);
  // Act
  try {
    service.buy("APPL", 100);
    // Assert
    expect(service.portfolio.assets.length).toBe(2);
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
  const service = new AssetsService(ratesGateway);
  // Act
  await service.buildFor("user123", 1000);
  // Assert
  expect(service.portfolio.assets.length).toBe(1);
  expect(service.portfolio.assets[0].symbol).toBe("USD");
  expect(service.portfolio.assets[0].quantity).toBe(1000);
});

// 4 Effect tests

test("save should produce a file with portfolio", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const service = new AssetsService(ratesGateway);
  await service.buildFor("user123", 1000);
  // Act
  await service.save();
  // Assert
  const actualExists = await file.exists("portfolio-user123.json");
  expect(actualExists).toBe(true);
});

