export class DataContainer {
  isLoading: boolean;

  isLoadedData: boolean;

  data: any;

  errors: any;

  constructor() {
    this.isLoading = false;
    this.isLoadedData = false;
  }
}
