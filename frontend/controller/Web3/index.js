import Web3 from 'web3'
const window = require('global/window')
const injectedWeb3 = new Web3(window.ethereum)
let currentWeb3Inst = null

export default class Web3Service {
  static getWeb3() {
    currentWeb3Inst = !currentWeb3Inst ? new Web3(injectedWeb3.currentProvider) : currentWeb3Inst
    return currentWeb3Inst
  }

  // 1: Mainnet
  // 3: Ropsten
  static async getNetWorkId() {
    return new Promise(async (resolve) => {
      currentWeb3Inst = !currentWeb3Inst ? new Web3(injectedWeb3.currentProvider) : currentWeb3Inst
      currentWeb3Inst.eth.net.getId().then((netId) => {
        console.log('getNetWorkId:', netId);
        return resolve(netId)
      })
    })
  }
  static toChecksumAddress(address) {
    try {
      currentWeb3Inst = !currentWeb3Inst ? new Web3(injectedWeb3.currentProvider) : currentWeb3Inst
      return currentWeb3Inst.utils.toChecksumAddress(address)
    } catch (e) {
      return null
    }
  }
  static async onMsgSign(address, nonce) {
    let p1 = new Promise((resolve, reject) => {
      try {
        currentWeb3Inst = !currentWeb3Inst
          ? new Web3(injectedWeb3.currentProvider)
          : currentWeb3Inst
        currentWeb3Inst.eth.personal.sign(
          currentWeb3Inst.utils.fromUtf8(nonce),
          address,
          (err, signature) => {
            if (err) return reject(err)
            return resolve({ address, signature })
          },
        )
      } catch (e) {
        console.log('onMsgSign - Error:', e)
        return resolve()
      }
    })
    let p2 = new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error('Request timeout')), 30000)
    })
    return Promise.race([p1, p2])
  }
}
