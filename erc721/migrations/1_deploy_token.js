const CustomERC721 = artifacts.require("CustomERC721");

module.exports = function (deployer, network, accounts) {
  deployer.then(async () => {
    const deployerAccount = accounts[0];

    const opts = {
      from: deployerAccount,
    };

    // Deploy CustomERC721
    const CustomERC721Contract = await deployer.deploy(CustomERC721, opts);
  });
};
