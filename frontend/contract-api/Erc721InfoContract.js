import Erc721InfoContractAbi from '../erc721/contracts/MorpheusNftManagerInfo.json'
import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'

let instance = null

export default class Erc721InfoContract {
  constructor(defaultAddress, deployedContractAddress) {
    if (!instance) {
      console.log('Erc721InfoContract - deployedContractAddress:', deployedContractAddress)
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = contract(Erc721InfoContractAbi)
      this.contract.setProvider(this.web3.currentProvider)
      this.contract.defaults({ from: defaultAddress })
      this.contract.at(deployedContractAddress).then((inst) => (this.contractInstance = inst))
    }

    return instance
  }

  async add(data) {
    const { userAddr, contractAddr, gasPrice } = data

    try {
      const result = await this.contractInstance.add(userAddr, contractAddr, {
        gasPrice,
      })
      console.log('Erc721InfoContract.add - result:', result)
      return result
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async get(data) {
    const { userAddr, gasPrice } = data
    console.log('Erc721InfoContract.get - userAddr:', userAddr)
    try {
      const result = await this.contractInstance.get(userAddr, {
        gasPrice,
      })
      console.log('Erc721InfoContract.get - result:', result)
      return result
    } catch (err) {
      console.log(err)
      return null
    }
  }
}
