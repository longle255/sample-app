export class Pagination<PaginationEntity> {
  public total: number;
  public pagesCount: number;
  public pageSize: number;
  public pageNumber: number;
  public results: PaginationEntity[];

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.total = paginationResults.total;
    this.pagesCount = paginationResults.pagesCount;
    this.pageNumber = paginationResults.pageNumber;
    this.results = paginationResults.results;
    this.pageSize = paginationResults.pageSize;
  }
}

export interface PaginationResultInterface<PaginationEntity> {
  results: PaginationEntity[];
  total: number;
  pagesCount: number;
  pageNumber: number;
  pageSize: number;
  next?: string;
  previous?: string;
}

export interface PaginationOptionsInterface {
  cond?: object;
  sort?: object;
  pageSize?: number;
  pageNumber?: number;
}

export const defaultOption: PaginationOptionsInterface = {
  cond: {
    isActive: true,
  },
  pageSize: 20,
  pageNumber: 0,
  sort: { createdAt: -1 },
};
