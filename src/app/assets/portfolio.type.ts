import { Asset } from "./asset.type";

export type Portfolio = {
  id: string;
  ownerId: string;
  assets: Asset[];
  updatedAt: Date;
  lastValue: number;
}
export const defaultPortfolio: Portfolio = {
  id: '',
  ownerId: '',
  assets: [],
  updatedAt: new Date(),
  lastValue: 0,
}
