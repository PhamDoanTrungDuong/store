import { IBasket } from "./IBasket";

export interface IUser {
      email: string;
      token: string;
      basket?: IBasket;
      roles?: string[];
      userName: string;
      phone?: string;
      pictureUrl?: string;
}

export interface MemberParams {
      searchTerm?: string;
      pageNumber: number;
      pageSize: number;
}