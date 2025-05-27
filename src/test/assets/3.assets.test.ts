import { Asset } from "../../app/assets/asset.type";
import { AssetsService } from "../../app/assets/assets.service";
import { PortfolioRepository } from "../../app/assets/portfolio.repository";
import { GetSymbolRate } from "../../app/assets/rates.gateway";

describe("assets service", () => {
  let ratesGatewayFake: GetSymbolRate;
  let portfolioRepositoryFake: PortfolioRepository;
  let assetsServiceSut: AssetsService;
  const dummyUserId = "user123";
  const dummyAmount = 1000;
  const fakeRatesResult = {
    name: "MSFT",
    symbol: "MSFT",
    price: 100,
    date: new Date()
  };
  const fakeLoadedPortfolio = {
    userId: dummyUserId,
    assets: [{
      name: "USD",
      type: "currency",
      symbol: "USD",  
      quantity: dummyAmount,
      lastPrice: 1,
      updatedAt: new Date()
    }]
  };


  beforeAll(() => {
    ratesGatewayFake = {
      get: jest.fn().mockImplementation((symbol: string) => {
        if (symbol === "MSFT") {
          return fakeRatesResult;
        }
        throw new Error(`Symbol ${symbol} not found`);
      })
    };

    portfolioRepositoryFake = {
      save: jest.fn().mockResolvedValue(undefined),
      load: jest.fn().mockResolvedValue(fakeLoadedPortfolio)
    };
  });

  beforeEach(async () => {
    assetsServiceSut = new AssetsService(ratesGatewayFake, portfolioRepositoryFake as any);
    await assetsServiceSut.buildFor(dummyUserId, dummyAmount);
    jest.clearAllMocks();
  });

  describe("buy", () => {
    it("should add asset to portfolio when buying stocks", async () => {
      // Act
      const validSymbol = fakeRatesResult.symbol;
      const inputQuantity = 5;
      assetsServiceSut.buy(validSymbol, inputQuantity);
      
      // Assert
      expect(assetsServiceSut.portfolio.assets.length).toBe(2);
      
      const expectedAsset: Asset = {
        name: fakeRatesResult.name,
        type: "stocks",
        symbol: validSymbol,
        quantity: inputQuantity,
        lastPrice: fakeRatesResult.price,
        updatedAt: expect.any(Date)
      };
      expect(assetsServiceSut.portfolio.assets[1]).toEqual(expectedAsset);
    });

    it("should throw error when buying unknown symbol", () => {
      // Act & Assert
      const inputInvalidSymbol = "AAPL";
      const dummyQuantity = 5;
      expect(() => assetsServiceSut.buy(inputInvalidSymbol, dummyQuantity)).toThrow(`Symbol ${inputInvalidSymbol} not found`);
    });
  });

  describe("save", () => {
    it("should call repository save with portfolio", async () => {
      // Act
      await assetsServiceSut.save();
      
      // Assert
      const currentPortfolio = assetsServiceSut.portfolio;
      expect(portfolioRepositoryFake.save).toHaveBeenCalledWith(currentPortfolio);
      expect(portfolioRepositoryFake.save).toHaveBeenCalledTimes(1);
    });
  });

  describe("calculateValue", () => {
    it("should sum all assets values", () => {
      // Act
      const actualValue = assetsServiceSut.calculateValue();
      
      // Assert
      expect(actualValue).toBe(dummyAmount);
    });

    it("should calculate total value after buying stocks", () => {
      // Arrange
      const validSymbol = fakeRatesResult.symbol;
      const inputQuantity = 5;
      assetsServiceSut.buy(validSymbol, inputQuantity);
      
      // Act
      const actualValue = assetsServiceSut.calculateValue();
      
      // Assert
      const expectedValue = dummyAmount + (inputQuantity * fakeRatesResult.price); 
      expect(actualValue).toBe(expectedValue);
    });
  });
});
