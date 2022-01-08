
import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import ERC20TestAbi from './ERC20Test.abi'

let instance = null

export default class ERC20TestContract {
  constructor(defaultAddress) {
    if (!instance) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = contract(ERC20TestAbi)
      this.contract.setProvider(this.web3.currentProvider)
      this.contract.defaults({ from: defaultAddress })
    }

    return instance
  }

  async approve(data) {
    const { contractAddress, landPriceInERC20Tokens } = data

    try {
      while (!receipt) {
        result = await this.web3.eth.approve(contractAddress, landPriceInERC20Tokens);
        if (receipt && result.status === true) {
          return true;
        }
        await sleep(1000);
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  };
  
}
