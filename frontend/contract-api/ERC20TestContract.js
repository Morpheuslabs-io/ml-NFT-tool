
import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import ERC20TestAbi from './ERC20Test.abi'

let instance = null

export default class ERC20TestContract {
  constructor(contractAddress) {
    this.web3 = Web3Service.getWeb3()
    this.contract = new this.web3.eth.Contract(ERC20TestAbi, contractAddress);
    return instance
  }

  async approve(data) {
    const { contractAddress, landPriceInERC20Tokens } = data

    try {
      return this.contract.methods.approve(contractAddress, landPriceInERC20Tokens);
    } catch (err) {
      console.log(err)
      return null
    }
  }
}
