import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandSalesAbi from './LandSales.abi'


let instance = null

export default class WethTestContract {
  constructor(contractAddress) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = new this.web3.eth.Contract(LandSalesAbi, contractAddress);
    return instance
  }

  // Launch a brandnew NFT token
  async buyLandInErc20Test(data) {
    const { contractAddress, lat, long } = data
    try {
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.buyLandInERC20(lat, long)
    } catch (err) {
      console.log(err)
      return null
    }
  }
  async buyLandInWethTest(data) {
    const { contractAddress, lat, long } = data
    try {
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.buyLandInWETH(lat, long)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async sendTransaction(transaction, from, privateKey = authorizedAccountPrivateKey) {
    console.log("from:", from);
    console.log('trans: ')
    console.log(transaction)
    
    const trans = await transaction;
    console.log(trans)
    // const 

    // transaction.then(async (res) => {
    //   console.log('gas')
    //   console.log(res)
    //   console.log(res.estimateGas())
    //   const gas = await res.estimateGas({ from });
    //   console.log('gas')
    //   console.log(gas)
    // });

    // const trans = await ( async () => {
    //   console.log('trans')
    //   const gas = await transaction.estimateGas({ from });
    //   console.log(gas)
    // })()

    let gas = null;
    try {
      gas = await trans.estimateGas({ from });
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

  async getLandPriceInErc20Tokens(landCategory) {
    const landPriceInERC20Tokens = await this.contract.methods.getLandPriceInErc20Tokens(landCategory).call();
  
    console.log(
      "getLandPriceInErc20Tokens - landCategory:",
      landCategory,
      ", landPriceInERC20Tokens:",
      landPriceInERC20Tokens
    );
    return landPriceInERC20Tokens;
  };
  

}
