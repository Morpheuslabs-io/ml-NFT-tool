import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandSalesAbi from './contract-interface/LandSalesAbi.json'
import ERC20TestAbi from './contract-interface/ERC20TestAbi.json'
import {
  LandSalesContractAddress,
  ERC20TokenContractAddress,
  WETHTokenContractAddress,
} from './contract-interface/ContractAddress'

let instance = null

export default class LandSalesContract {
  constructor(defaultAddress) {
    if (!instance) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.landSalesContract = contract(LandSalesAbi)
      this.landSalesContract.setProvider(this.web3.currentProvider)
      this.landSalesContract.defaults({ from: defaultAddress })

      this.wethContract = contract(ERC20TestAbi)
      this.wethContract.setProvider(this.web3.currentProvider)
      this.wethContract.defaults({ from: defaultAddress })

      this.erc20Contract = contract(ERC20TestAbi)
      this.erc20Contract.setProvider(this.web3.currentProvider)
      this.erc20Contract.defaults({ from: defaultAddress })
    }

    return instance
  }

  // ERC20
  async buyLandInErc20Test(data) {
    try {
      const contractInstance = await this.landSalesContract.at(LandSalesContractAddress)

      const landPriceInERC20Tokens = await contractInstance.getLandPriceInErc20Tokens(0)

      console.log('landPriceInERC20Tokens:', landPriceInERC20Tokens.toString())

      await this.approveErc20TestToken(landPriceInERC20Tokens)

      // Send tx
      const receipt = await contractInstance.buyLandInERC20(data.longitude, data.latitude)

      // Wait for tx confirmation
      await this.waitForTxConfirmation(receipt.tx)

      console.log('buyLandInERC20 - tx:', receipt.tx)
      return receipt.tx
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async approveErc20TestToken(amount) {
    const erc20ContractInstance = await this.erc20Contract.at(ERC20TokenContractAddress)
    const receipt = await erc20ContractInstance.approve(LandSalesContractAddress, amount)

    // Wait for tx confirmation
    await this.waitForTxConfirmation(receipt.tx)

    console.log('approveErc20TestToken - tx:', receipt.tx)
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

  // WETH
  async buyLandInWethTest(data) {
    try {
      const contractInstance = await this.landSalesContract.at(LandSalesContractAddress)

      const landPriceInWeth = await contractInstance.getLandPriceInWETH(0)

      console.log('landPriceInWeth:', landPriceInWeth.toString())

      await this.approveWETH(landPriceInWeth)

      // Send tx
      const receipt = await contractInstance.buyLandInWETH(data.longitude, data.latitude)

      // Wait for tx confirmation
      await this.waitForTxConfirmation(receipt.tx)

      console.log('buyLandInWethTest - tx:', receipt.tx)
      return receipt.tx
    } catch (err) {
      console.log(err)
      return null
    }
  }

  async approveWETH(amount) {
    const wethContractInstance = await this.wethContract.at(WETHTokenContractAddress)
    const receipt = await wethContractInstance.approve(LandSalesContractAddress, amount)

    // Wait for tx confirmation
    await this.waitForTxConfirmation(receipt.tx)

    console.log('approveWETH - tx:', receipt.tx)
    return receipt.tx
  }
}
