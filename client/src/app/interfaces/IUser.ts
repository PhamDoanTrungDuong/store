import { IBasket } from "./IBasket";

export interface IUser {
      email: string;
      token: string;
      basket?: IBasket;
      roles?: string[];
}