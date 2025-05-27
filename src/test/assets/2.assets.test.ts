//import { AssetsService } from "../../app/assets/assets.service";
//import { RatesGateway } from "../../app/assets/rates.gateway";
//import { file } from "../../app/file/file.adapter";

import { Asset } from "../../app/assets/asset.type";
import { AssetsService } from "../../app/assets/assets.service";
import { PortfolioRepository } from "../../app/assets/portfolio.repository";
import { GetSymbolRate, RatesGateway } from "../../app/assets/rates.gateway";


// Doubles

// 1-Stubs

test("buy should add asset to portfolio or throw error", async () => {
  // Arrange
   const ratesGatewayDummy: GetSymbolRate = {
    get: jest.fn().mockReturnValue({
      name: "MSFT",
      symbol: "MSFT",
      price: 100,
      date: new Date()
    })
  };
  const fakeToday = new Date('2001-01-01T12:00:00.000Z');
  jest.useFakeTimers().setSystemTime(fakeToday);
  const assetsServiceSut = new AssetsService(ratesGatewayDummy);
  const dummyUserId = "user123";
  const dummyAmount = 1000;
  await assetsServiceSut.buildFor(dummyUserId, dummyAmount);
  // Act
  assetsServiceSut.buy("MSFT", 5);
  // Assert
  const expectedAssetsLength = 2;
  expect(assetsServiceSut.portfolio.assets.length).toBe(expectedAssetsLength);
  const expectedSecondAsset: Asset = {
    name: "MSFT",
    type: "stocks",
    symbol: "MSFT",
    quantity:5,
    lastPrice: 100,
    updatedAt: fakeToday
  };
  expect(assetsServiceSut.portfolio.assets[1]).toEqual(expectedSecondAsset);
});

// 2-Spies

test("save should call repository save", async () => {
  // Arrange
  const ratesGateway = new RatesGateway();
  const portfolioRepositorySpy:PortfolioRepository = {
    save: jest.fn(),
    load: jest.fn()
  };
  const assetsServiceSut = new AssetsService(ratesGateway, portfolioRepositorySpy as any);
  const dummyUserId = "user123";
  const dummyAmount = 1000;
  await assetsServiceSut.buildFor(dummyUserId, dummyAmount);
  // Act
  await assetsServiceSut.save();
  // Assert
  expect(portfolioRepositorySpy.save).toHaveBeenCalledWith(assetsServiceSut.portfolio);
});

// 3-Fakes

test("should buy and sell MSFT stocks", async () => {
  // Arrange
  const ratesGatewayFake: GetSymbolRate = {
    get: jest.fn().mockImplementation((symbol: string) => {
      if (symbol === "MSFT") {
        return {
          name: "MSFT",
          symbol: "MSFT",
          price: 100,
          date: new Date()
        };
      }
      throw new Error(`Symbol ${symbol} not found`);
    })
  };
  const portfolioRepositorySpy:PortfolioRepository = {
    save: jest.fn(),
    load: jest.fn()
  };
  const assetsServiceSut = new AssetsService(ratesGatewayFake, portfolioRepositorySpy as any);
  const dummyUserId = "user123";
  const dummyAmount = 1000;
  await assetsServiceSut.buildFor(dummyUserId, dummyAmount);
  // Act
  assetsServiceSut.buy("MSFT", 5);
  assetsServiceSut.sell("MSFT", 2);
  // Assert
  const expectedAssetsQuantity   = 3;
  expect(assetsServiceSut.portfolio.assets[1].quantity).toBe(expectedAssetsQuantity);
});

test("should throw error if symbol not found", async () => {
  // Arrange
 const ratesGatewayFake: GetSymbolRate = {
    get: jest.fn().mockImplementation((symbol: string) => {
      if (symbol === "MSFT") {
        return {
          name: "MSFT",
          symbol: "MSFT",
          price: 100,
          date: new Date()
        };
      }
      throw new Error(`Symbol ${symbol} not found`);
    })
  };
  const assetsServiceSut = new AssetsService(ratesGatewayFake);
  const dummyUserId = "user123";
  const dummyAmount = 1000;
  await assetsServiceSut.buildFor(dummyUserId, dummyAmount);
  // Act & Assert
  expect(() => assetsServiceSut.buy("AAPL", 5)).toThrow("Symbol AAPL not found" );
});

// 4-Dummy
test("calculateValue should sum all assets values", async () => {
  // Arrange
  const ratesGatewayDummy: GetSymbolRate = {
    get: jest.fn()
  };
  const assetsServiceSut = new AssetsService(ratesGatewayDummy);
  const dummyUserId = "user123";
  const dummyAmount = 1000;
  await assetsServiceSut.buildFor(dummyUserId, dummyAmount);
  const expectedValue = 1000;
  // Act
  const actualValue = assetsServiceSut.calculateValue();
  // Assert
  expect(actualValue).toBe(expectedValue);
});

// 5-Mock

// ToDo: implement repository mock and load method

