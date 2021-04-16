const CustomERC721 = artifacts.require("CustomERC721");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    async function getNetID() {
      return new Promise(function (resolve, reject) {
        web3.providers.HttpProvider.prototype.sendAsync =
          web3.providers.HttpProvider.prototype.send;

        web3.currentProvider.sendAsync(
          {
            jsonrpc: "2.0",
            method: "net_version",
            params: [],
            id: 0,
          },
          function (err, result) {
            if (err) {
              console.error(err.message);
              reject(err);
            } else {
              resolve(result.result);
            }
          }
        );
      });
    }
    const chainId = await getNetID();
    console.log(chainId);

    const deployerAccount = accounts[0];

    const opts = {
      from: deployerAccount,
    };

    // Deploy CustomERC721
    const name = "SOME_NAME";
    const symbol = "SOME_SYM";
    const CustomERC721Contract = await deployer.deploy(
      CustomERC721,
      name,
      symbol,
      chainId,
      opts
    );
  });
};
