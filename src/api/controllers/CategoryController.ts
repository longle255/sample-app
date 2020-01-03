import { JsonController, Get } from 'routing-controllers';

@JsonController('/categories')
export class CategoryController {
  @Get()
  public findAll(): object[] {
    return [
      { name: 'All', alias: 'All' },
      { name: 'Asian', alias: 'Asian' },
      { name: 'EU', alias: 'EU' },
    ];
  }
}
