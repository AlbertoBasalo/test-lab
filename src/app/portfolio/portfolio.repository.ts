import { file } from "../file/file.adapter.ts";
import { Portfolio } from "./portfolio.type.ts";

export const  portfolioRepository = {
  async load(ownerId: string): Promise<Portfolio>{
    const filePath = `portfolio-${ownerId}.json`;
    return await file.readJson<Portfolio>(filePath);
  },
  async save(portfolio: Portfolio): Promise<void>{
    const filePath = `portfolio-${portfolio.ownerId}.json`;
    return await file.writeJson(filePath, portfolio);
  }
}