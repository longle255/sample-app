import faker from 'faker';
import { IUser, User, Roles } from '../../src/api/models/User';

export class UserFactory {
  public user: any = {
    firstName: 'User',
    lastName: 'Test',
    email: 'user@sampleapi.com',
    password: '123456',
    role: Roles.USER
  };
  public admin: any = {
    firstName: 'Admin',
    lastName: 'Test',
    email: 'admin@sampleapi.com',
    password: '123456',
    role: Roles.ADMIN
  };

  public createRandom(): Promise<IUser> {
    const gender = faker.random.number(1);
    const firstName = faker.name.firstName(gender);
    const lastName = faker.name.lastName(gender);
    const email = faker.internet.email(firstName, lastName);
    const password = '123456';

    return User.create({ firstName, lastName, email, password } as any);
  }

  public create(user: any): Promise<IUser> {
    return User.create(user as IUser);
  }

  public createUser(): Promise<IUser> {
    return User.create(this.user);
  }
  public createAdmin(): Promise<IUser> {
    return User.create(this.admin);
  }

  public async createMany(count: number): Promise<IUser[]> {
    const ret: IUser[] = [];
    for (let i = 0; i < count; i++) {
      const user: IUser = await this.createRandom();
      ret.push(user);
    }
    return ret;
  }
}
