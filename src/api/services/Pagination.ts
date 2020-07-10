export class Pagination<PaginationEntity> {
  public total: number;
  public pagesCount: number;
  public pageSize: number;
  public pageNumber: number;
  public data: PaginationEntity[];

  constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
    this.total = paginationResults.total;
    this.pagesCount = paginationResults.pagesCount;
    this.pageNumber = paginationResults.pageNumber;
    this.data = paginationResults.data;
    this.pageSize = paginationResults.pageSize;
  }
}

export interface PaginationResultInterface<PaginationEntity> {
  data: PaginationEntity[];
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
  q?: string; // query term
}

export const defaultOption: PaginationOptionsInterface = {
  cond: {
    isActive: true,
  },
  pageSize: 20,
  pageNumber: 0,
  sort: { createdAt: -1 },
};
