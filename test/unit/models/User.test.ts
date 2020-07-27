import { User } from '../../../src/api/models/User';

describe('UserModel', () => {
  test('Should test some static function of user', () => {
    const user = new User({
      firstName: 'Long',
      lastName: 'Le',
      password: '123456'
    })
    expect(user.fullName).toBe('Long Le');
  });
});
