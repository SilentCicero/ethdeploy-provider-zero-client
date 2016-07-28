## ethdeploy-provider-zero-client

The zero client standard Web3 provider for the [ethdeploy](http://github.com/silentcicero/ethdeploy) Ethereum smart-contract deployment system.

## Zero Client

The zero-client provider was designed by the @MetaMask team, namely, @kumavis to handle the management of accounts and key signing for web3 RPC interaction.

See more here: [zero-client](https://github.com/MetaMask/provider-engine#built-for-zero-clients)

## Provider Object Example
```
{
  type: 'zero-client',
  getAccounts: function(cb) {
    cb(null, ['0x2233eD250Ea774146B0fBbC1da0Ffa6a81514cCC']);
  },
  signTransaction: function(rawTx, cb) {
    const privateKey = new  Buffer('c55c58355a32c095c7074837467382924180748768422589f5f75a384e6f3b33', 'hex');

    const tx = new Tx(rawTx);
    tx.sign(privateKey);

    cb(null, ethUtil.bufferToHex(tx.serialize()));
  },
  host: 'https://morden.infura.io',
  port: 8545,
}
```

Note, please do not store your accounts or private keys in your ethdeploy provider settings... please! That is stupid and dangerous.

## Install

```
npm install --save ethdeploy-provider-zero-client
```

## Licence

Released under the MIT License, see [LICENSE.md](LICENSE.md) file.
