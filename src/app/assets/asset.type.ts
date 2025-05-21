export type AssetType = "cash" | "crypto" | "stocks";

export type Asset = {
  name: string;
  type: AssetType;
  symbol: string;
  quantity: number;
  updatedAt: Date;
  lastPrice: number;
} 