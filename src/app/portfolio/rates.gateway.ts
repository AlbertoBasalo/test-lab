import { Rate } from "./rate.type.ts";

export const ratesGateway= {
  get(symbol: string): Rate {
    const date = new Date();
    const price = Number.parseFloat((Math.random() * 499 + 1).toFixed(2));
    return { symbol, date, price };
  }
}