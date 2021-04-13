import Erc721ContractAbi from '../erc721/contracts/CustomERC721.json'
import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'

let instance = null

export default class Erc721Contract {
  constructor(defaultAddress) {
    if (!instance) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = contract(Erc721ContractAbi)
      this.contract.setProvider(this.web3.currentProvider)
      this.contract.defaults({ from: defaultAddress })
    }

    return instance
  }

  async create(data) {
    const { name, symbol, to, tokenURI, gasPrice } = data
    console.log('gasPrice:', gasPrice)
    try {
      const contractInstance = await this.contract.new(
        name,
        symbol,
        Web3Service.toChecksumAddress(to),
        tokenURI,
        {
          gasPrice,
        },
      )
      return contractInstance
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async name(contractAddress) {
    try {
      console.log('contractAddress:', contractAddress)
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.name()
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async symbol(contractAddress) {
    try {
      console.log('contractAddress:', contractAddress)
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.symbol()
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async checkAuthorized(contractAddress, checkAddress) {
    try {
      console.log('contractAddress:', contractAddress)
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.checkAuthorized(checkAddress)
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async createCollectible(data) {
    const { contractAddress, tokenURI, gasPrice } = data
    try {
      console.log('contractAddress:', contractAddress)
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.createCollectible(tokenURI, {
        gasPrice,
      })
    } catch (err) {
      console.log(err)
      return null
    }
  }
}
