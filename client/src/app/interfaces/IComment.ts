export interface IComment {
      id: number;
      pictureUrl?: string;
      userId: number
      username: string
      productId: number
      productName: string
      content: string
      commentSent: string
      rate: number
      items: any
}