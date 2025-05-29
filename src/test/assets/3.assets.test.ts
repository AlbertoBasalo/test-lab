import { Asset } from "../../app/assets/asset.type";
import { AssetsService } from "../../app/assets/assets.service";
import { PortfolioRepository } from "../../app/assets/portfolio.repository";
import { GetSymbolRate } from "../../app/assets/rates.gateway";

// Pro

describe("The assets service", () => {
  let assetsService: AssetsService; // same SUT, different instances on each test
  
  const inputUserId = "user123";
  const inputAmount = 1000;
  const fakeRatesResult = {
    name: "MSFT",
    symbol: "MSFT",
    price: 100,
    date: new Date()
  };
  const fakeLoadedPortfolio = {
    userId: inputUserId,
    assets: [{
      name: "USD",
      type: "currency",
      symbol: "USD",  
      quantity: inputAmount,
      lastPrice: 1,
      updatedAt: new Date()
    }]
  };
  
  const fakeRatesGateway: GetSymbolRate = {
    get: jest.fn().mockImplementation((symbol: string) => {
      if (symbol === fakeRatesResult.symbol) return fakeRatesResult;
      throw new Error(`Symbol ${symbol} not found`);
    })
  };
  const fakePortfolioRepository: PortfolioRepository = {
    save: jest.fn().mockResolvedValue(undefined),
    load: jest.fn().mockResolvedValue(fakeLoadedPortfolio)
  };

  beforeEach(async () => {
    assetsService = new AssetsService(fakeRatesGateway, fakePortfolioRepository );
    await assetsService.buildFor(inputUserId, inputAmount);
  });

  describe("when a valid buy is made", () => {
    const validSymbol = fakeRatesResult.symbol;
    const validQuantity = 5;
    beforeEach(() => {
      // Act
      assetsService.buy(validSymbol, validQuantity);
    });
    it("should add asset to portfolio", async () => {
      // Assert
      const assetsLength = assetsService.portfolio.assets.length;
      expect(assetsLength).toBe(2);
    });
    it("should be the correct asset", async () => {
      // Assert
      const secondAsset = assetsService.portfolio.assets[1];
      const expectedAsset: Asset = {
        name: fakeRatesResult.name,
        type: "stocks",
        symbol: validSymbol,
        quantity: validQuantity,
        lastPrice: fakeRatesResult.price,
        updatedAt: expect.any(Date)
      };
      expect(secondAsset).toEqual(expectedAsset);
    });
  });

  describe("when a buy with unknown symbol is made", () => {
    it("should throw symbol not found error ", () => {
      // Arrange
      const invalidSymbol = "AAPL";
      const validQuantity = 5;
      // Act and Assert
      const expectedError = `Symbol ${invalidSymbol} not found`;
      expect(() => assetsService.buy(invalidSymbol, validQuantity)).toThrow(expectedError);
    });
  });

  describe("when a buy with not enough cash is made", () => {
    it("should throw not enough cash error ", () => {
      // Arrange
      const validSymbol = fakeRatesResult.symbol;
      const invalidQuantity = 50;
      const cost = fakeRatesResult.price * invalidQuantity;
      const have = inputAmount;
      const expectedError = `Not enough cash. Need: ${cost} - Have: ${have}`;
      // Act and Assert
      expect(() => assetsService.buy(validSymbol, invalidQuantity)).toThrow(expectedError);
    });
  });

  describe("when save is called", () => {
    it("should call repository save with portfolio", async () => {
      // Act
      await assetsService.save();
      // Assert
      const currentPortfolio = assetsService.portfolio;
      expect(fakePortfolioRepository.save).toHaveBeenCalledWith(currentPortfolio);
      expect(fakePortfolioRepository.save).toHaveBeenCalledTimes(1);
    });
  });


  // ToDo: refactor to scenarios based test
  describe("when calculateValue is called", () => {
    it("should sum all assets values", () => {
      // Act
      const actualValue = assetsService.calculateValue();
      // Assert
      expect(actualValue).toBe(inputAmount);
    });

    it("should calculate total value after buying stocks", () => {
      // Arrange
      const validSymbol = fakeRatesResult.symbol;
      const validQuantity = 5;
      assetsService.buy(validSymbol, validQuantity);
      // Act
      const actualValue = assetsService.calculateValue();
      // Assert
      const expectedValue = 1500;//inputAmount + (validQuantity * fakeRatesResult.price); 
      expect(actualValue).toBe(expectedValue);
    });
  });
});
