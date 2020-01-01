import { createConnection, cleanUp } from '../../utils/database';
import { User } from '../../../src/api/models/User';

describe('UserModel', () => {
  beforeAll(async done => {
    await createConnection();
    await cleanUp(User);
    done();
  });

  test('Should be able to create new user', async done => {
    const user = new User({
      email: 'long@test.com',
      firstName: 'Long  ',
      lastName: '  Le',
      password: '123456',
    });
    await user.save();
    expect(user.fullName).toBe('Long Le');
    expect(user.referralCode.length).toBeGreaterThan(0);
    const compare = await user.comparePassword('123456');
    expect(compare).toBe(true);
    done();
  });
});
