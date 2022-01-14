import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandRegistryAbi from './contract-interface/LandRegistryAbi.json'

let instance = null

export default class LandRegistryContract {
  constructor(defaultAddress) {
    if (!instance) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = contract(LandRegistryAbi)
      this.contract.setProvider(this.web3.currentProvider)
      this.contract.defaults({ from: defaultAddress })

      return instance
    }
  }
}
