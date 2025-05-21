import { Portfolio } from "./portfolio.type";

export class AssetsService{
  public portfolio: Portfolio;

  constructor(portfolio : Portfolio ){
    this.portfolio=portfolio;
  }

  public buy(symbol: string, units:number){

  }

  public sell(symbol: string, units:number){

  }

  public calculateValue(): number{
    return 0;
  }
}