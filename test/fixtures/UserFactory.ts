import faker from 'faker';
import { IUser, User } from '../../src/api/models/User';

export class UserFactory {
    public constant = {
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bruce.wayne@wayne-enterprises.com',
        password: '1234',
    };

    public createRandom(): Promise<IUser> {
        const gender = faker.random.number(1);
        const firstName = faker.name.firstName(gender);
        const lastName = faker.name.lastName(gender);
        const email = faker.internet.email(firstName, lastName);

        const user = new User();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = '1234';
        return User.create(user);
    }

    public createConstant(): Promise<IUser> {
        const user = new User();
        user.firstName = this.constant.firstName;
        user.lastName = this.constant.lastName;
        user.email = this.constant.email;
        user.password = this.constant.password;
        return User.create(user);
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
