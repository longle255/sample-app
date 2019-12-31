import { BtcWalletProvider } from '../../../src/api/services/walletProviders/BtcWalletProvider.bitcore';
import { configureLogger } from '../../utils/logger';
// import { env } from '../../../src/env';
import _ from 'lodash';
import Container from 'typedi';

const defaultAccount = {
    label: 'inl-test',
    pass: '12345678',
    index: 0,
    account: undefined,
};
describe('BtcWalletProvider', () => {
    // -------------------------------------------------------------------------
    // Setup up
    // -------------------------------------------------------------------------

    beforeAll(async () => {
        configureLogger();
    });

    // beforeEach(() => {});

    // -------------------------------------------------------------------------
    // Tear down
    // -------------------------------------------------------------------------

    afterAll(async done => {});

    // -------------------------------------------------------------------------
    // Test cases
    // -------------------------------------------------------------------------

    test('should create new BTC wallet on bitcore testnet', async () => {
        // tested
        // const service = Container.get<BtcWalletProvider>(BtcWalletProvider);
        // const wallet = await service.createWallet(defaultAccount.label);
        const account = await BtcWalletProvider.createAccount(defaultAccount.label, { network: 'livenet' });
        console.log(account);

        const newWallet = new BtcWalletProvider(account, { network: 'livenet' });
        console.log('created wallet:', newWallet);
        console.log('created wallet:', newWallet.export());
        const mainAddr = await newWallet.getMainAddresses();
        console.log('main address:', mainAddr);
        defaultAccount.account = account;
    });

    test('should create new BTC address on bitcore testnet', async () => {
        // tested
        const account = new BtcWalletProvider(defaultAccount.account, { network: 'livenet' });
        const address = await account.createAddress();
        console.log('created address:', address);
        const mainAddr = await account.getMainAddresses();
        console.log('main address:', mainAddr);
    });

    // test('should return the balance of test wallet blockchain.info', async () => {
    //     const wallet = new BtcWallet(env.walletServices.btc.blockchain.accountGuid, env.walletServices.btc.blockchain.accountPass);
    //     const { balance } = await wallet.getBalance();
    //     expect(balance).toBeDefined();
    // });

    // test('should create new account in the wallet', async () => {
    //     const wallet = new BtcWallet(env.walletServices.btc.blockchain.accountGuid, env.walletServices.btc.blockchain.accountPass);
    //     const label = `test-account-${Date.now()}`;
    //     const account = await wallet.createAccount({ label });
    //     expect(account).toBeDefined();
    //     expect(account.label).toBe(label);
    // });

    // test('should create 1000 new account in the wallet', async () => {
    //     jest.setTimeout(9999 * 1000);
    //     const wallet = new BtcWallet(env.walletServices.btc.blockchain.accountGuid, env.walletServices.btc.blockchain.accountPass);
    //     for (let i = 576; i < 1000; i++) {
    //         const now = Date.now();
    //         const label = `test-account-${i}`;
    //         const account = await wallet.createAccount({ label });
    //         const then = Date.now();
    //         console.log('Creating account ', label, 'takes', (then - now) / 1000, 'seconds');
    //         expect(account).toBeDefined();
    //         expect(account.label).toBe(label);
    //     }
    // });

    // test('should get defaultAccount in the wallet', async () => {
    //     const wallet = new BtcWallet(env.walletServices.btc.blockchain.accountGuid, env.walletServices.btc.blockchain.accountPass);
    //     const account = await wallet.getAccount(defaultAccount.index);
    //     expect(account.label).toBe(defaultAccount.label);
    //     console.log(account);
    // });

    // test('should list all accounts in the wallet', async () => {
    //     const wallet = new BtcWallet(env.walletServices.btc.blockchain.accountGuid, env.walletServices.btc.blockchain.accountPass);
    //     const accounts = await wallet.listAccounts();
    //     expect(accounts.length).toBeGreaterThan(0);
    //     expect(_.find(accounts, { label: defaultAccount.label })).toBeDefined();
    //     console.log(accounts.length);
    // });

    // test('should get unused address in the account', async () => {
    //     const wallet = new BtcWallet(env.walletServices.btc.blockchain.accountGuid, env.walletServices.btc.blockchain.accountPass);
    //     const { address } = await wallet.getAccountReceiveAddress(defaultAccount.index);
    //     console.log(address);
    //     expect(address).toBeDefined();
    // });
});
