export class Pagination<PaginationEntity> {
  public total: number;
  public pagesCount: number;
  public pageSize: number;
  public page: number;
  public results: PaginationEntity[];

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.total = paginationResults.total;
    this.pagesCount = paginationResults.pagesCount;
    this.page = paginationResults.page;
    this.results = paginationResults.results;
    this.pageSize = paginationResults.pageSize;
  }
}

export interface PaginationResultInterface<PaginationEntity> {
  results: PaginationEntity[];
  total: number;
  pagesCount: number;
  page: number;
  pageSize: number;
  next?: string;
  previous?: string;
}

export interface PaginationOptionsInterface {
  cond?: object;
  sort?: object;
  pageSize?: number;
  page?: number;
}

export const defaultOption: PaginationOptionsInterface = {
  cond: {
    isActive: true,
  },
  pageSize: 20,
  page: 0,
  sort: { createdAt: -1 },
};
