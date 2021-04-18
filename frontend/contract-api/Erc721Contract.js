import Erc721ContractAbi from '../erc721/contracts/MorpheusNftManager.json'
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

  // Launch a brandnew NFT token
  async create(data) {
    const { name, symbol, chainId, gasPrice } = data
    console.log('gasPrice:', gasPrice)
    try {
      const contractInstance = await this.contract.new(name, symbol, chainId, {
        gasPrice,
      })
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
      return true
    } catch (err) {
      console.log(err)
      return false
    }
  }

  async getSenderNonce(contractAddress, senderAddress) {
    try {
      console.log('contractAddress:', contractAddress)
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.getNonce(senderAddress)
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async createCollectibleFuncSig(contractAddress, tokenURI) {
    console.log('contractAddress:', contractAddress)
    const contractInstance = new this.web3.eth.Contract(Erc721ContractAbi.abi, contractAddress)
    // const contractInstance = await this.contract.at(contractAddress)
    return contractInstance.methods.createCollectible(tokenURI).encodeABI()
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

  async addAuthorized(data) {
    const { contractAddress, userAddress, gasPrice } = data
    try {
      console.log('contractAddress:', contractAddress)
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.addAuthorized(userAddress, {
        gasPrice,
      })
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async revokeAuthorized(data) {
    const { contractAddress, userAddress, gasPrice } = data
    try {
      console.log('contractAddress:', contractAddress)
      const contractInstance = await this.contract.at(contractAddress)
      return contractInstance.clearAuthorized(userAddress, {
        gasPrice,
      })
    } catch (err) {
      console.log(err)
      return null
    }
  }
}
