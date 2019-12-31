import { Container } from 'typedi';
import { IUser, User } from '../../src/api/models/User';
import { IdentityToken, TokenTypes, IIdentityToken } from '../../src/api/models/IdentityToken';
import { IdentityTokenService } from '../../src/api/services/IdentityTokenService';
import { UserService } from '../../src/api/services/UserService';
import { createConnection, cleanUp } from '../utils/database';
import { configureLogger } from '../utils/logger';
import { UserFactory } from '../fixtures/UserFactory';

const userFactory = new UserFactory();
// const userFactory = Container.get<UserFactory>(UserFactory);
describe('IdentityTokenService', () => {
    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async () => {
        configureLogger();
        await createConnection();
        await userFactory.createConstant();
        await userFactory.createMany(10);
    });

    // beforeEach(() => {});

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(async done => {
        await cleanUp(User);
        await cleanUp(IdentityToken);
        done();
    });

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    test('should create a new identity in the database', async done => {
        const userService = Container.get<UserService>(UserService);
        const tokenService = Container.get<IdentityTokenService>(IdentityTokenService);
        const user: IUser = await userService.findOne({ email: userFactory.constant.email });
        const token: IIdentityToken = await tokenService.generateToken(user, TokenTypes['refresh-token']);
        expect(token.email).toBe(user.email);
        expect(token.expires.getTime()).toBeGreaterThan(0);
        done();
    });
});
