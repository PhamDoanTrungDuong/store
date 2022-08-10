import { IBasket } from "./IBasket";

export interface IUser {
      email: string;
      token: string;
      basket?: IBasket;
      roles?: string[];
      username: string;
      phone?: string;
}

export interface MemberParams {
      pageNumber: number;
      pageSize: number;
}