import { createConnection, cleanAll, disconnect } from '../../lib/database';
import { User } from '../../../src/api/models/User';

describe('UserModel', () => {
  beforeAll(async done => {
    await createConnection();
    done();
  });

  afterAll(async () => {
    await cleanAll();
    await disconnect();
  });

  test('Should be able to create new user and validate password', async () => {
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
  });
});
