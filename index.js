// require web3
const ProviderEngine = require('web3-provider-engine');
const zeroClientProvider = require('web3-provider-engine/zero');

// fix getAccounts method
const fixGetAccounts = function(providerObject) {
  const fixedProviderObject = Object.assign({}, providerObject);
  const oldGetAccountsMethod = providerObject.getAccounts;

  // fix get accounts
  if (typeof fixedProviderObject.getAccounts !== 'undefined') {
    fixedProviderObject.getAccounts = function(getAccountsCallback) {
      const oldCallback = getAccountsCallback;

      // build fixed callback with lowercased accounts
      const fixedCallback = function(accountsError, accountsResult) {
        const fixedAccountsResult = accountsResult.slice(0);

        // if no error, fixed result
        if (!accountsError) {
          fixedAccountsResult.map(function(item) {
            return String(item.toLowerCase());
          });
        }

        // fire oldd callback with new fix
        oldCallback(accountsError, fixedAccountsResult);
      }

      // fire get accounts method
      oldGetAccountsMethod(fixedCallback);
    };
  }

  // return fixed provider object
  return fixedProviderObject;
};

// fix ethereumjs-tx rawTx object
const fixEthereumJSTxObject = function(rawTx) {
  const rawTxMutation = Object.assign({}, rawTx);

  // fix rawTx gaslimit
  if (typeof rawTxMutation.gas !== 'undefined') {
    rawTxMutation.gasLimit = rawTxMutation.gas;
    delete rawTxMutation.gas;
  }

  // fix data by prefixing it with zero
  if (typeof rawTxMutation.data !== 'undefined'
      && rawTxMutation.data.slice(0, 2) !== '0x') {
    rawTxMutation.data = '0x' + rawTxMutation.data;
  }

  // return new mutated raw tx object
  return rawTxMutation;
}

// fix signTransaction method with rawTx fix
const fixSignTransactionMethod = function(providerObject) {
  const fixedProviderObject = Object.assign({}, providerObject);

  // object has signTransaction
  if (typeof fixedProviderObject.signTransaction !== 'undefined') {
    // store old sign transaction method
    const oldSignTransactionMethod = fixedProviderObject.signTransaction;

    // build new provider object signTransaciton method
    fixedProviderObject.signTransaction = function(rawTx, cb) {
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
  return zeroClientProvider(fixGetAccounts(fixSignTransactionMethod(providerObjectMutation)));
};
