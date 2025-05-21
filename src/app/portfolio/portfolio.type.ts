import { Asset } from "./asset.type";

export type Portfolio ={
  id: string;
  ownerId: string;
  date: Date;
  value: number;
  assets: Asset[];
}