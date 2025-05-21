import { idUtils } from "../utils/id.utils";
import { PortfolioRepository } from "./portfolio.repository";
import { defaultPortfolio, Portfolio } from "./portfolio.type";
import { RatesGateway } from "./rates.gateway";

export class AssetsService {
  public portfolio: Portfolio = defaultPortfolio;
  private ratesGateway: RatesGateway;
  private portfolioRepository: PortfolioRepository = new PortfolioRepository();

  constructor(ratesGateway: RatesGateway) {
    this.ratesGateway = ratesGateway;
  }

  public async buildFor(ownerId: string, usdAmount: number = 1000) {
    this.portfolio = {
      id: await idUtils.generate(),
      ownerId,
      assets: [
        {
          symbol: 'USD',
          quantity: usdAmount,
          updatedAt: new Date(),
          lastPrice: 1,
          type: 'cash',
          name: 'USD',
        },
      ],
      updatedAt: new Date(),
      lastValue: usdAmount,
    };
  }

  public buy(symbol: string, units: number) {
    const rate = this.ratesGateway.get(symbol);
    const cost = rate.price * units;
    if (!this.hasEnoughUnits('USD', cost)) {
      const usdAsset = this.portfolio.assets.find(asset => asset.symbol === 'USD');
      const have = usdAsset ? usdAsset.quantity : 0;
      throw new Error(`Not enough cash. Need: ${cost} - Have: ${have}`);
    }
    const asset = this.portfolio.assets.find(asset => asset.symbol === symbol);
    if (asset) {
      asset.quantity += units;
      asset.updatedAt = new Date();
      asset.lastPrice = rate.price;
    } else {
      this.portfolio.assets.push({ symbol, quantity: units, updatedAt: new Date(), lastPrice: rate.price, type: 'stocks', name: rate.name });
    }
    this.portfolio.lastValue = this.calculateValue();
  }

  public sell(symbol: string, units: number) {
    if (!this.hasEnoughUnits(symbol, units)) {
      throw new Error('Not enough units');
    }
    const asset = this.portfolio.assets.find(asset => asset.symbol === symbol);
    if (!asset) {
      throw new Error('Asset not found');
    }
    const rate = this.ratesGateway.get(symbol);
    const profit = rate.price * units;
    asset.quantity -= units;
    asset.updatedAt = new Date();
    asset.lastPrice = rate.price;
    // add to usd cash
    const usdAsset = this.portfolio.assets.find(asset => asset.symbol === 'USD');
    if (usdAsset) {
      usdAsset.quantity += profit;
      usdAsset.updatedAt = new Date();
      usdAsset.lastPrice = rate.price;
    } else {
      this.portfolio.assets.push({ symbol: 'USD', quantity: profit, updatedAt: new Date(), lastPrice: rate.price, type: 'cash', name: 'USD' });
    }
    this.portfolio.lastValue = this.calculateValue();
  }

  public print() {
    console.log(`Portfolio: ${this.portfolio.id} for ${this.portfolio.ownerId}`);
    console.log(`Last updated: ${this.portfolio.updatedAt}`);
    console.log(`Last value: ${this.portfolio.lastValue}`);
    console.log(`Symbol - Quantity - Last price - Value`);
    console.log(`----------------------------------------`);
    for (const asset of this.portfolio.assets) {
      console.log(`${asset.symbol} - ${asset.quantity} - ${asset.lastPrice} - ${asset.quantity * asset.lastPrice}`);
    }
  }

  public save() {
    return this.portfolioRepository.save(this.portfolio);
  }

  private hasEnoughUnits(symbol: string, units: number): boolean {
    const asset = this.portfolio.assets.find(asset => asset.symbol === symbol);
    return asset ? asset.quantity >= units : false;
  }

  public calculateValue(): number {
    return this.portfolio.assets.reduce((acc, asset) => acc + asset.quantity * asset.lastPrice, 0);
  }
}