import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandSalesAbi from './LandSalesAbi.json'


let instance = null

export default class WethTestContract {


  constructor(defaultAddress) {
    if (!instance) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      console.log('LandSalesContract')
      console.log(LandSalesAbi)
      this.contract = contract(LandSalesAbisAbi)
      console.log(this.contract)
      this.contract.setProvider(this.web3.currentProvider)
      this.contract.defaults({ from: defaultAddress })
    }

    return instance
  }

  /*
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

  async approveWethToken(contractAddress, amount) {
    try {
      return this.contract.methods.approve(contractAddress, amount);
    } catch (err) {
      console.log(err)
      return null
    }
  };

  */
}
