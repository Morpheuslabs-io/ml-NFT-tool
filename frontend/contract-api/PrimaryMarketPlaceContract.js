import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import ERC20TestContract from './ERC20TestContract'
import PrimaryMarketPlaceAbi from './PrimaryMarketPlace.abi'

let instance = null

export default class PrimaryMarketPlaceContract {
  constructor(defaultAddress) {
    if (!instance) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = contract(PrimaryMarketPlaceAbi)
      this.contract.setProvider(this.web3.currentProvider)
      this.contract.defaults({ from: defaultAddress })
    }

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
      gasPrice: await this.web3.eth.getGasPrice(),
    };
    const receipt = await signTransaction(options, privateKey);
  
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
    
    // const transaction = this.erc20TestContract.methods.approve(
    //   data.spender,
    //   data.amount
    // );
  
    // Send tx
    const receipt = await sendTransaction(
      data.transaction,
      data.userAccountAddress,
      data.userAccountPrivateKey
    );
  
    // Wait for tx confirmation
    await waitForTxConfirmation(receipt.transactionHash);
  
    console.log("approveErc20TestToken - tx:", receipt.transactionHash);
    return receipt.transactionHash;
  };

  async getLandPriceInErc20Tokens(contractAddress, landCategory = 1) {
    const contractInstance = await this.contract.at(contractAddress)
    
    const landPriceInERC20Tokens = await contractInstance
      .getLandPriceInErc20Tokens(landCategory)
      .call();
  
    console.log(
      "getLandPriceInErc20Tokens - landCategory:",
      landCategory,
      ", landPriceInERC20Tokens:",
      landPriceInERC20Tokens
    );
    return landPriceInERC20Tokens;
  };
  

}
