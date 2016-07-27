// require web3
const zeroClientProvider = require('web3-provider-engine/dist/ZeroClientProvider');

// main zero client provider
module.exports = function(providerObject) {
  const rpcUrlString = `${providerObject.host}:${providerObject.port}`;
  const providerObjectMutation = Object.assign(providerObject, {rpcUrl: rpcUrlString});

  // return web3 provider
  return zeroClientProvider(providerObjectMutation);
};
