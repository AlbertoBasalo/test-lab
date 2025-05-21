export type AssetType = "cash" | "crypto" | "stocks";

export type Asset= {
  id: string;
  name: string;
  type: AssetType;
  symbol: string;
  quantity: number;
  price: number;
} 