import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandSalesAbi from './LandSales.abi'


let instance = null

export default class LandSalesContract {
  constructor(contractAddress) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = new this.web3.eth.Contract(LandSalesAbi, contractAddress);

      console.log('--: ' + LandSalesContract)
      console.log(this.contract.methods)
    return instance
  }

  async sendTransaction(transaction, from, privateKey = authorizedAccountPrivateKey) {
    console.log("from:", from);
    console.log('trans: ')
    console.log(transaction)
    
    let gas = null;
    try {
      gas = await transaction.estimateGas({ from });
      console.log("gas: ", gas);
    } catch (err) {
      console.log("sendTransaction - estimateGas - Error:", err.message);
      return null;
    }
  
    const options = {
      to: transaction._parent._address,
      data: transaction.encodeABI(),
      gas,
      gasPrice: await this.web3.eth.getGasPrice(),
    };
    const receipt = await this.signTransaction(options, privateKey);
  
    return receipt;
  };
  
  async signTransaction(options, privateKey = authorizedAccountPrivateKey) {
    const signed = await this.web3.eth.accounts.signTransaction(options, privateKey);
    const receipt = await this.web3.eth.sendSignedTransaction(signed.rawTransaction);
    return receipt;
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

  async approveErc20TestToken(data) {
    // Send tx
    const receipt = await this.sendTransaction(
      data.transaction,
      data.userAccountAddress,
      data.userAccountPrivateKey
    );
  
    // Wait for tx confirmation
    await this.waitForTxConfirmation(receipt.transactionHash);
  
    console.log("approveErc20TestToken - tx:", receipt.transactionHash);
    return receipt.transactionHash;
  };

  async approveWethTestToken(data) {
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
  }

  async getLandPriceInWethTokens(landCategory) {
    const landPriceInWethTokens = await this.contract.methods.getLandPriceInWETH(landCategory).call();
  
    console.log(
      "getLandPriceInWethTokens - landCategory:",
      landCategory,
      ", landPriceInWethTokens:",
      landPriceInWethTokens
    );
    return landPriceInWethTokens;
  };

  async getLandPriceInErc20Tokens(landCategory, userAccountAddress, gasPrice) {
    
    console.log('getLandPriceInErc20Tokens - landCategory: ' + landCategory + ' gasPrice: ' + gasPrice);


    const landPriceInERC20Tokens = await this.contract.methods.getLandPriceInErc20Tokens(landCategory).call(
      function (err, res) {
        //do stuff
        if(!err) {
          console.log('callback err: ')
          console.log(err)
        } else {
          console.log('callback res:')
          console.log(res)
        }
      }
    )
    // .call({
    //   userAccountAddress, gasPrice
    // });
  
    console.log(
      "getLandPriceInErc20Tokens - landCategory:",
      landCategory,
      ", landPriceInERC20Tokens:",
      landPriceInERC20Tokens
    );
    return landPriceInERC20Tokens;
  };
  
  async buyLandInWETH(data) {
    const transaction = this.contract.methods.methods.buyLandInWETH(
      data.landParcelLat,
      data.landParcelLong
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
  };
}
