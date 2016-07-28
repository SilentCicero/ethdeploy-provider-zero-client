// require web3
const ProviderEngine = require('web3-provider-engine');
const zeroClientProvider = require('web3-provider-engine/zero');

// fix ethereumjs-tx rawTx object
const fixEthereumJSTxObject = function(rawTx) {
  const rawTxMutation = Object.assign({}, rawTx);

  // fix rawTx gaslimit
  if (typeof rawTxMutation.gas !== 'undefined') {
    rawTxMutation.gasLimit = rawTxMutation.gas;
    delete rawTxMutation.gas;
  }

  // fix data by prefixing it with zero
  if (typeof rawTxMutation.data !== 'undefined') {
    rawTxMutation.data = '0x' + rawTxMutation.data;
  }

  // return new mutated raw tx object
  return rawTxMutation;
}

// fix signTransaction method with rawTx fix
const fixSignTransactionMethod = function(providerObject) {
  const fixedProviderObject = Object.assign({}, providerObject);

  // object has signTransaction
  if (typeof providerObject.signTransaction !== 'undefined') {
    // store old sign transaction method
    const oldSignTransactionMethod = providerObject.signTransaction;

    // build new provider object signTransaciton method
    providerObject.signTransaction = function(rawTx, cb) {
      // fire old callback
      oldSignTransactionMethod(fixEthereumJSTxObject(rawTx), cb);
    };
  }

  // return fixed provider object
  return fixedProviderObject;
};

// main zero client provider
module.exports = function(providerObject) {
  // build rpc url for zero client provider
  const rpcUrlString = providerObject.rpcUrl || `${providerObject.host}:${providerObject.port}`;

  // mutate provider object with new URL
  const providerObjectMutation = Object.assign(providerObject, {rpcUrl: rpcUrlString});

  // return web3 provider
  return zeroClientProvider(fixedProviderObject(providerObjectMutation));
};
