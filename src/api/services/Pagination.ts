export class Pagination<PaginationEntity> {
    public items_count: number;
    public pages_count: number;
    public page: number;
    public results: PaginationEntity[];

    constructor(paginationResults: PaginationResultInterface<PaginationEntity>) {
        this.items_count = paginationResults.items_count;
        this.pages_count = paginationResults.pages_count;
        this.page = paginationResults.page;
        this.results = paginationResults.results;
    }
}

export interface PaginationResultInterface<PaginationEntity> {
    results: PaginationEntity[];
    items_count: number;
    pages_count: number;
    page: number;
    next?: string;
    previous?: string;
}

export interface PaginationOptionsInterface {
    cond: object;
    sort?: object;
    limit: number;
    page: number;
}
