export class MyWallet {
    static create(password: any, apiCode: any, options: any): any;
    constructor(guid: any, password: any, options: any);
    guid: any;
    api: any;
    getParams: any;
    archiveAccount(xpubOrIndex: any): any;
    archiveAddress(address: any): any;
    createAccount(options: any): any;
    enableHD(): any;
    getAccount(xpubOrIndex: any): any;
    getAccountBalance(xpubOrIndex: any): any;
    getAccountReceiveAddress(xpubOrIndex: any): any;
    getAddress(address: any, options: any): any;
    getBalance(): any;
    listAccounts(): any;
    listAddresses(): any;
    listXPubs(): any;
    login(): any;
    newAddress(options: any): any;
    send(address: any, amount: any, options: any): any;
    sendMany(recipients: any, options: any): any;
    unarchiveAccount(xpubOrIndex: any): any;
    unarchiveAddress(address: any): any;
}
export class Receive {
    constructor(xpub: any, callback: any, key: any, options: any);
    xpub: any;
    callback: any;
    key: any;
    gapLimit: any;
    checkgap(): any;
    generate(query: any): any;
}
export class Socket {
    static wsUrlForNetwork(network: any): any;
    constructor(options: any);
    close: any;
    getReadyState: any;
    op: any;
    addListener(type: any, listener: any): any;
    emit(type: any, args: any): any;
    eventNames(): any;
    getMaxListeners(): any;
    listenerCount(type: any): any;
    listeners(type: any): any;
    off(type: any, listener: any): any;
    on(type: any, listener: any): any;
    onBlock(callback: any): any;
    onClose(callback: any): any;
    onOpen(callback: any): any;
    onTransaction(callback: any, options: any): any;
    once(type: any, listener: any): any;
    prependListener(type: any, listener: any): any;
    prependOnceListener(type: any, listener: any): any;
    rawListeners(type: any): any;
    removeAllListeners(type: any, ...args: any[]): any;
    removeListener(type: any, listener: any): any;
    setMaxListeners(n: any): any;
    subscribe(sub: any, options: any): any;
}
export namespace blockexplorer {
    function getAddress(p0: any, p1: any): any;
    function getBalance(p0: any, p1: any): any;
    function getBlock(p0: any, p1: any): any;
    function getBlockHeight(p0: any, p1: any): any;
    function getBlocks(p0: any, p1: any): any;
    function getLatestBlock(p0: any): any;
    function getMultiAddress(p0: any, p1: any): any;
    function getTx(p0: any, p1: any): any;
    function getUnconfirmedTx(p0: any): any;
    function getUnspentOutputs(p0: any, p1: any): any;
    function usingNetwork(network: any): any;
}
export namespace exchange {
    function fromBTC(amount: any, currency: any, options: any): any;
    function getTicker(options: any): any;
    function toBTC(amount: any, currency: any, options: any): any;
}
export namespace pushtx {
    function pushtx(p0: any, p1: any): any;
    function usingNetwork(network: any): any;
}
export namespace statistics {
    function get(options: any): any;
    function getChartData(chartType: any, options: any): any;
    function getPoolData(options: any): any;
}
