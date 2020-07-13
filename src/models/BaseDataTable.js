import { DataContainer } from './DataContainer';

export interface IPagination {
  pageSize: number;
  current: number;
  total: number;
}

export interface ISort {
  field: string;
  order: string;
}

export class BaseDataTable extends DataContainer {
  isSelectedAll: boolean;

  keyword: string = '';

  pagination: IPagination;

  sort: ISort;

  data = [];

  constructor() {
    super();

    this.pagination = {
      pageSize: 10,
      current: 1,
      total: 1,
    };

    this.sort = {
      field: '',
      order: '',
    };

    this.data = [];
    this.isLoading = false;
    this.isLoadedData = false;
    this.isSelectedAll = false;
  }
}
