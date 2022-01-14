import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandRegistryAbi from './contract-interface/LandRegistryAbi.json'
import { LandRegistryContractAddress } from './contract-interface/ContractAddress'

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

  async getAllLand(userAddress) {
    const contractInstance = await this.contract.at(LandRegistryContractAddress)
    const landOf = await contractInstance.landOf(userAddress)

    const landOfParsedResult = []
    for (const landIndex of Object.keys(landOf)) {
      landOfParsedResult.push([landOf[landIndex][0].toString(), landOf[landIndex][1].toString()])
    }

    console.log('getAllLand - userAddress:', userAddress, ', result:', landOfParsedResult)

    return landOfParsedResult
  }

  async updateLand(userAddress) {
    const contractInstance = await this.contract.at(LandRegistryContractAddress)
    const landOf = await contractInstance.landOf(userAddress)

    const landData = JSON.stringify({
      name: 'trung',
      description: 'trung mido',
      image: 'https://some-link.com',
    })
    
    const longitudeList = landOf[0]
    const latitudeList = landOf[1]
    
    const receipt = await contractInstance.updateLandData(
      longitudeList[0],
      latitudeList[0],
      landData,
    )

    // Wait for tx confirmation
    await this.waitForTxConfirmation(receipt.tx)

    console.log('updateLand - tx:', receipt.tx)

    return receipt.tx
  }

  async waitForTxConfirmation(txHash) {
    let receipt = null
    try {
      while (!receipt) {
        receipt = await this.web3.eth.getTransactionReceipt(txHash)
        if (receipt && receipt.status === true) {
          return true
        }
        await sleep(1000)
      }
    } catch (err) {
      console.log(err)
      return false
    }
  }
}
