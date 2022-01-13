import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandSalesAbi from './LandSalesAbi.json'
import ERC20TestAbi from './ERC20TestAbi.json'


let instance = null

export default class LandSalesContract {

  constructor(defaultAddress) {
    if (!instance) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = contract(LandSalesAbi)
      this.contract.setProvider(this.web3.currentProvider)
      this.contract.defaults({ from: defaultAddress })

      this.wethContract = contract(ERC20TestAbi)
      this.wethContract.setProvider(this.web3.currentProvider)
      this.wethContract.defaults({ from: defaultAddress })

      this.erc20Contract = contract(ERC20TestAbi)
      this.erc20Contract.setProvider(this.web3.currentProvider)
      this.erc20Contract.defaults({ from: defaultAddress })
    }

    return instance
  }

  // ERC20
  async buyLandInErc20Test(data) {
    try {
      console.log('buyLandInErc20Test')
      const contractInstance = await this.contract.at(data.landSalesContractAddress)
      console.log('contractInstance')
      console.log(contractInstance)
      
      const landPriceInERC20Tokens = await contractInstance.getLandPriceInErc20Tokens(data.landCategory).call();
      // const landPriceInErc20Tokens = await this.getLandPriceInErc20Tokens(contractInstance, landCategory);

      console.log("landPriceInErc20Tokens:", landPriceInErc20Tokens);
      
      await this.approveErc20TestToken({
        spender: data.userAccountAddress,
        amount: landPriceInErc20Tokens,
        userAccountAddress: data.userAccountAddress,
        userAccountPrivateKey: data.userAccountPrivateKey,
        landSalesContractAddress: data.landSalesContractAddress
      });

      const transaction = contractInstance.buyLandInERC20(
        data.longitude,
        data.latitude
      );

      // Send tx
      const receipt = await this.sendTransaction(
        transaction,
        data.userAccountAddress,
        data.userAccountPrivateKey
      );

      // Wait for tx confirmation
      await this.waitForTxConfirmation(receipt.transactionHash);

      console.log("buyLandInERC20 - tx:", receipt.transactionHash);
      return receipt.transactionHash;

    } catch (err) {
      console.log(err)
      return null
    }
  }

  async approveErc20TestToken(data) {
    const erc20ContractInstance = await this.erc20Contract.at(data.landSalesContractAddress)

    const transaction = erc20ContractInstance.methods.approve(
      data.spender,
      data.amount
    );
  
    // Send tx
    const receipt = await this.sendTransaction(
      transaction,
      data.userAccountAddress,
      data.userAccountPrivateKey
    );
  
    // Wait for tx confirmation
    await waitForTxConfirmation(receipt.transactionHash);
  
    console.log("approveErc20TestToken - tx:", receipt.transactionHash);
    return receipt.transactionHash;
  };

  async waitForTxConfirmation(txHash) {
    let receipt = null;
    try {
      while (!receipt) {
        receipt = await this.web3.eth.getTransactionReceipt(txHash);
        if (receipt && receipt.status === true) {
          return true;
        }
        await sleep(1000);
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  async sendTransaction(transaction, from, privateKey = authorizedAccountPrivateKey) {
    console.log("from:", from);
    let gas = null;
    try {
      gas = await transaction.estimateGas({ from });
    } catch (err) {
      console.log("sendTransaction - estimateGas - Error:", err.message);
      return null;
    }
  
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas,
      gasPrice: await web3.eth.getGasPrice(),
    };
    const receipt = await this.signTransaction(options, privateKey);
  
    return receipt;
  };

  async signTransaction(options, privateKey = authorizedAccountPrivateKey) {
    const signed = await web3.eth.accounts.signTransaction(options, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    return receipt;
  };

  // async getLandPriceInErc20Tokens(contractInstance, landCategory = 0) {
  //   const landPriceInERC20Tokens = await contractInstance.getLandPriceInErc20Tokens(landCategory);
  
  //   console.log("getLandPriceInErc20Tokens - landCategory:", landCategory,
  //     ", landPriceInERC20Tokens:", landPriceInERC20Tokens
  //   );
  //   return landPriceInERC20Tokens;
  // };

  //
  // WETH
  //
  async buyLandInWethTest(data) {
    console.log('buyLandInErc20Test')
    const contractInstance = await this.contract.at(data.landSalesContractAddress)
    console.log('contractInstance')
    console.log(contractInstance)
    
    const landPriceInERC20Tokens = await contractInstance.getLandPriceInWETH(data.landCategory).call();
    // const landPriceInWETH = await getLandPriceInWETH();

    await this.approveWETH({
      spender: data.userAccountAddress,
      amount: landPriceInErc20Tokens,
      userAccountAddress: data.userAccountAddress,
      userAccountPrivateKey: data.userAccountPrivateKey,
      landSalesContractAddress: data.landSalesContractAddress
    });

    const transaction = contractInstance.buyLandInWETH(
      data.landParcelLong,
      data.landParcelLat
    );

    // Send tx
    const receipt = await this.sendTransaction(
      transaction,
      data.userAccountAddress,
      data.userAccountPrivateKey
    );

    // Wait for tx confirmation
    await this.waitForTxConfirmation(receipt.transactionHash);

    console.log("buyLandInWETH - tx:", receipt.transactionHash);
    return receipt.transactionHash;
  }

  async approveWETH(data) {
    const wethTokenContract = await this.wethContract.at(data.landSalesContractAddress)

    const transaction = wethTokenContract.methods.approve(
      data.spender,
      data.amount
    );
  
    // Send tx
    const receipt = await this.sendTransaction(
      transaction,
      data.userAccountAddress,
      data.userAccountPrivateKey
    );
  
    // Wait for tx confirmation
    await waitForTxConfirmation(receipt.transactionHash);
  
    console.log("approveWETH - tx:", receipt.transactionHash);
    return receipt.transactionHash;
  };
}
