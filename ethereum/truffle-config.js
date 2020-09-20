module.exports = {
  networks: {
    // environment when running `truffle develop`
    develop: {
      host: '127.0.0.1',
      port: 6545,
      network_id: '*', // Match any network id
      gas: 4712388,
      gasPrice: 0,
      websockets: true
    },
    // environment when running `truffle migrate`
    development: {
      host: '127.0.0.1',
      port: 7545,
      network_id: '5777', // Match any network id
      gas: 4712388,
      gasPrice: 0,
      websockets: true
    },
    mainlocal: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '1',
      skipDryRun: true,
      gas: 6000000,
      websockets: true
    },
    testnet: {
      host: 'https://rinkeby.infura.io/yeyODM5MwlsKyyJqs2vx',
      port: 80,
      network_id: '*', // Match any network id
      skipDryRun: true,
      gas: 6000000,
    }
  },
  compilers: {
    solc: {
      version: '0.4.18',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
    },
  }
};
