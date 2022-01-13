import contract from '@truffle/contract'
import Web3Service from '../controller/Web3'
import LandRegistry from './LandRegistry.abi'


let instance = null

export default class LandRegistryContract {
  constructor(contractAddress) {
      instance = this
      this.web3 = Web3Service.getWeb3()
      this.contract = new this.web3.eth.Contract(LandRegistry, contractAddress);

      console.log('--: ' + LandRegistryContract)
      console.log(this.contract.methods)
    return instance
  }

  async getLandData(latitude, longitude) {
    const landData = await this.contract.methods.landData(longitude, latitude).call();
  
    console.log("getLandData:", landData);
    return landData;
  };


  async getAllLandOf(owner) {
    const allLandOf = await this.contract.methods.landOf(owner).call();

    console.log("getAllLandOf:", owner, "\n", allLandOf);
    return allLandOf;
  }

  async updateLandData(data) {
    console.log("updateLandData - data:", data);
  
    const transaction = this.contract.methods.updateLandData(
      data.landParcelLong,
      data.landParcelLat,
      data.data
    );
  
    return transaction;
  };
}
