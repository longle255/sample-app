export class Pagination<PaginationEntity> {
  public itemsCount: number;
  public pagesCount: number;
  public limit: number;
  public page: number;
  public results: PaginationEntity[];

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.itemsCount = paginationResults.itemsCount;
    this.pagesCount = paginationResults.pagesCount;
    this.page = paginationResults.page;
    this.results = paginationResults.results;
    this.limit = paginationResults.limit;
  }
}

export interface PaginationResultInterface<PaginationEntity> {
  results: PaginationEntity[];
  itemsCount: number;
  pagesCount: number;
  page: number;
  limit: number;
  next?: string;
  previous?: string;
}

export interface PaginationOptionsInterface {
  cond?: object;
  sort?: object;
  limit?: number;
  page?: number;
}

export const defaultOption: PaginationOptionsInterface = {
  cond: {
    isActive: true,
  },
  limit: 20,
  page: 0,
  sort: { createdAt: -1 },
};
