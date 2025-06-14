export type Asset = {
  id: number;
  name: string;
  type: 'cash' | 'crypto' | 'stocks';
  symbol: string;
  quantity: number;
  currentPrice?: number; // Optional: to be fetched or used for calculation
};

export type Portfolio = {
  id: string;
  name: string;
  currency: string;
  date: Date;
  assets: Asset[];
  totalValue: number;
};

export type Rate = {
  symbol: string;
  price: number;
};

// Placeholder for file adapter - will be refined for side effects
const mockFileAdapter = {
  writeJson: async (filePath: string, data: Portfolio | Record<string, unknown>): Promise<void> => {
    console.log(`Simulating saving to ${filePath}:`, data);
    // In a real scenario, this would write to a file system.
    return Promise.resolve();
  },
  readJson: async (filePath: string): Promise<Portfolio | Record<string, unknown>> => {
    console.log(`Simulating reading from ${filePath}`);
    // In a real scenario, this would read from a file system.
    // For now, let's return a default mock portfolio if it's a portfolio file.
    if (filePath.includes('portfolio')) {
      return {
        id: 'mock-portfolio',
        name: 'Mock Portfolio',
        assets: [],
        totalValue: 0,
        currency: 'USD',
        date: new Date(),
      };
    }
    return Promise.resolve({});
  },
};

export const portfolioUtils = {
  _currentPortfolio: {
    id: 'default-portfolio',
    name: 'My Portfolio',
    currency: 'USD', // Default currency
    date: new Date(),
    assets: [
      // Initialize with some cash
      {
        id: Date.now(),
        name: 'US Dollars',
        type: 'cash',
        symbol: 'USD',
        quantity: 10000,
        currentPrice: 1,
      },
    ] as Asset[],
    totalValue: 10000, // Initial total value is the cash amount
  } as Portfolio,

  // Pure function: Calculates total value of assets based on their currentPrice
  calculatePortfolioValue: (assets: Asset[]): number => {
    let totalValue = 0;
    for (const asset of assets) {
      if (asset.type === 'cash') {
        totalValue += asset.quantity;
      } else if (asset.currentPrice !== undefined && asset.quantity > 0) {
        // Ensure currentPrice is defined for non-cash assets
        totalValue += asset.quantity * asset.currentPrice;
      }
    }
    return totalValue;
  },

  // Pure function: Calculates the total value of a given portfolio snapshot
  calculatePortfolioSnapshotValue: (portfolio: Portfolio): number => {
    // This function relies on the simplified `calculatePortfolioValue` for the core logic.
    return portfolioUtils.calculatePortfolioValue(portfolio.assets);
  },

  // Function to get a random rate for a symbol
  getRateForSymbol: (symbol: string): Rate => {
    // Generate a random price, e.g., between 1 and 500
    const price = Number.parseFloat((Math.random() * 499 + 1).toFixed(2));
    return { symbol, price };
  },

  // Async function to simulate fetching the current rate for a symbol
  fetchCurrentRateForSymbol: async (symbol: string): Promise<Rate> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 100)); // Delay 100-600ms
    // Reuse the random rate generation logic
    const rate = portfolioUtils.getRateForSymbol(symbol);
    return rate;
  },

  // Function that changes state: Buys an asset and adds to a portfolio
  buyAsset: (assetToBuy: Omit<Asset, 'id' | 'currentPrice'>, pricePerUnit: number): Portfolio => {
    const cost = assetToBuy.quantity * pricePerUnit;
    const cashAsset = portfolioUtils._currentPortfolio.assets.find(
      (a) => a.type === 'cash' && a.symbol === portfolioUtils._currentPortfolio.currency,
    );

    if (!cashAsset || cashAsset.quantity < cost) {
      throw new Error('Not enough cash to buy asset.');
    }

    cashAsset.quantity -= cost;

    const existingAsset = portfolioUtils._currentPortfolio.assets.find(
      (a) => a.symbol === assetToBuy.symbol && a.type === assetToBuy.type,
    );

    if (existingAsset) {
      existingAsset.quantity += assetToBuy.quantity;
      existingAsset.currentPrice = pricePerUnit; // Update price
    } else {
      portfolioUtils._currentPortfolio.assets.push({
        ...assetToBuy,
        id: Date.now() + Math.random(), // Simple unique ID
        currentPrice: pricePerUnit,
      });
    }
    // Recalculate total value
    portfolioUtils._currentPortfolio.totalValue = portfolioUtils.calculatePortfolioValue(
      portfolioUtils._currentPortfolio.assets,
    );
    return {
      ...portfolioUtils._currentPortfolio,
      assets: [...portfolioUtils._currentPortfolio.assets],
    };
  },

  // Function that changes state: Sells an asset from the portfolio
  sellAsset: (
    assetSymbolToSell: string,
    assetType: Asset['type'],
    quantityToSell: number,
    pricePerUnit: number,
  ): Portfolio => {
    const assetToSell = portfolioUtils._currentPortfolio.assets.find(
      (a) => a.symbol === assetSymbolToSell && a.type === assetType && a.type !== 'cash',
    );

    if (!assetToSell) {
      throw new Error(
        `Asset with symbol ${assetSymbolToSell} and type ${assetType} not found in portfolio.`,
      );
    }
    if (assetToSell.quantity < quantityToSell) {
      throw new Error(
        `Not enough quantity of ${assetSymbolToSell} to sell. Available: ${assetToSell.quantity}, trying to sell: ${quantityToSell}`,
      );
    }

    const proceeds = quantityToSell * pricePerUnit;
    assetToSell.quantity -= quantityToSell;
    assetToSell.currentPrice = pricePerUnit; // Update price even if partially sold

    const cashAsset = portfolioUtils._currentPortfolio.assets.find(
      (a) => a.type === 'cash' && a.symbol === portfolioUtils._currentPortfolio.currency,
    );

    if (!cashAsset) {
      // This should ideally not happen if portfolio is initialized correctly
      throw new Error('Cash asset not found in portfolio. Portfolio state is inconsistent.');
    }
    cashAsset.quantity += proceeds;

    // Optionally remove asset if quantity is zero
    if (assetToSell.quantity === 0) {
      portfolioUtils._currentPortfolio.assets = portfolioUtils._currentPortfolio.assets.filter(
        (a) => !(a.symbol === assetSymbolToSell && a.type === assetType),
      );
    }

    // Recalculate total value
    portfolioUtils._currentPortfolio.totalValue = portfolioUtils.calculatePortfolioValue(
      portfolioUtils._currentPortfolio.assets,
    );
    return {
      ...portfolioUtils._currentPortfolio,
      assets: [...portfolioUtils._currentPortfolio.assets],
    };
  },

  getPortfolio: (): Portfolio => {
    return {
      ...portfolioUtils._currentPortfolio,
      assets: [...portfolioUtils._currentPortfolio.assets],
    };
  },

  // Function with a side effect: Saves the portfolio to a "file"
  savePortfolio: async (portfolio: Portfolio): Promise<void> => {
    const filePath = `portfolio-${portfolio.id}.json`;
    await mockFileAdapter.writeJson(filePath, portfolio);
    console.log(`Portfolio ${portfolio.id} saved.`);
  },

  // Function with a side effect: Loads a portfolio from a "file"
  loadPortfolio: async (portfolioId: string): Promise<Portfolio> => {
    const filePath = `portfolio-${portfolioId}.json`;
    const loadedData = await mockFileAdapter.readJson(filePath);
    // Basic type assertion, in a real app, you'd add more robust validation
    if (
      typeof loadedData === 'object' &&
      loadedData !== null &&
      'id' in loadedData &&
      'assets' in loadedData
    ) {
      // Potentially parse date strings back to Date objects if they were stringified
      if (typeof loadedData.date === 'string') {
        loadedData.date = new Date(loadedData.date);
      }
      return loadedData as Portfolio;
    }
    throw new Error(`Failed to load or parse portfolio with id ${portfolioId}. Invalid format.`);
  },

  // Helper to reset state for testing or re-initialization if needed
  resetPortfolio: (
    id = 'default-portfolio',
    name = 'My Portfolio',
    currency = 'USD',
    initialCash = 10000,
  ) => {
    portfolioUtils._currentPortfolio = {
      id,
      name,
      currency,
      date: new Date(),
      assets: [
        {
          id: Date.now(),
          name: `${currency} Cash`,
          type: 'cash',
          symbol: currency,
          quantity: initialCash,
          currentPrice: 1,
        },
      ],
      totalValue: initialCash,
    };
  },
};
