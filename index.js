// require web3
const ProviderEngine = require('web3-provider-engine');
const zeroClientProvider = require('web3-provider-engine/zero');

// main zero client provider
module.exports = function(providerObject) {
  const rpcUrlString = `${providerObject.host}:${providerObject.port}`;
  const providerObjectMutation = Object.assign(providerObject, {rpcUrl: rpcUrlString});

  // return web3 provider
  return zeroClientProvider(providerObjectMutation);
};
