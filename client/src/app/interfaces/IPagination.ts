export interface IPagination {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalCount: number;
}

export class PaginationResponse<T> {
      items: T;
      pagination: IPagination;

      constructor(items: T, pagination: IPagination){
            this.items = items;
            this.pagination = pagination;
      };
}