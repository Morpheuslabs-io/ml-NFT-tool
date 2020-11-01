import Web3Service from 'controller/Web3'
import storeRedux from 'controller/Redux/store/configureStore'
import PageReduxAction from 'controller/Redux/actions/pageActions'
import StorageActions from 'controller/Redux/actions/storageActions'
import { showNotification, checkIsSigned } from './function'
import { isFirefox, isChrome, isMobile } from 'react-device-detect'
import { METAMASK } from './constants'
export default class ReduxServices {
  static async callDispatchAction(action) {
    storeRedux.dispatch(action)
  }

  static getCurrentLang() {
    const { locale } = storeRedux.getState()
    return locale.lang || 'en'
  }

  static async onEnableMetaMask(callback = null) {
    let currentWeb3Inst = window.web3
    if (currentWeb3Inst && typeof currentWeb3Inst !== 'undefined') {
      currentWeb3Inst.version.getNetwork((err) => {
        if (!err) {
          const enableMetaMask = () => {
            currentWeb3Inst.currentProvider &&
              currentWeb3Inst.currentProvider.enable().then(() => {
                callback && callback()
              })
          }
          currentWeb3Inst.eth.getAccounts((err, accounts) => {
            if (!err) {
              if (!accounts || accounts.length <= 0) {
                enableMetaMask()
              }
            }
          })
        }
      })
    }
  }

  static async refreshMetaMask() {
    const { metamaskRedux, userData } = storeRedux.getState()

    const checkMetaMask = () => {
      return new Promise(async (resolve) => {
        const { metamaskRedux } = storeRedux.getState()
        const isShowLog = false
        const showLogStatus = (message) => {
          isShowLog && console.log(message)
        }

        let newStatus = Object.assign({}, metamaskRedux)
        let currentWeb3Inst = window.web3
        try {
          if (typeof currentWeb3Inst === 'undefined') {
            if (metamaskRedux.status === METAMASK.status.loading) {
              showLogStatus('No web3 detected')
              newStatus.status = METAMASK.status.noWeb3
              newStatus.network = 0
              resolve(newStatus)
            } else if (newStatus.status !== METAMASK.status.noWeb3) {
              showLogStatus('Lost web3')
              window.location.reload(true)
              newStatus.status = METAMASK.status.error
              newStatus.network = 0
              resolve(newStatus)
            }
          } else {
            showLogStatus('web3 detected')

            // Get metamask ether network
            let p1 = new Promise((resolve, reject) => {
              try {
                currentWeb3Inst.version.getNetwork((err, network) => {
                  if (err) {
                    return reject(err)
                  }
                  return resolve(network)
                })
              } catch (e) {
                showLogStatus('Get metamask netWork error' + e)
                return reject(e)
              }
            })
            // Close p1 promise if over time
            let p2 = new Promise(function (resolve, reject) {
              setTimeout(() => {
                return reject(new Error('request timeout'))
              }, 1800)
            })

            Promise.race([p1, p2])
              .then((networkNew) => {
                const networkParse = parseInt(networkNew)
                const web3 = currentWeb3Inst
                const findNetwork = METAMASK.network[networkParse]
                showLogStatus('web3 network is ' + (findNetwork || 'Unknown'))

                let network = findNetwork || 'Unknown'
                web3.eth.getAccounts((err, accounts) => {
                  showLogStatus(
                    'Ethereum Account detected' + accounts + 'newStatus' + newStatus.account,
                  )
                  if (accounts && newStatus.account && newStatus.account !== accounts[0]) {
                    // Clear data and reload page when change new account
                    this.callDispatchAction(StorageActions.setUserData(null))
                    newStatus.status = METAMASK.status.accountChanged
                    newStatus.network = network
                    resolve(newStatus)
                  }
                  if (err) {
                    newStatus.status = METAMASK.status.error
                    newStatus.network = network
                    resolve(newStatus)
                  } else if (accounts && accounts.length > 0) {
                    newStatus.status = METAMASK.status.ready
                    newStatus.network = network
                    newStatus.account = accounts[0].toLowerCase()
                    resolve(newStatus)
                  }
                })
              })
              .catch((e) => {
                showLogStatus('Check network error' + e)
                newStatus.status = METAMASK.status.locked
                newStatus.network = 0
                resolve(newStatus)
              })
          }
        } catch (e) {
          newStatus.status = METAMASK.status.error
          newStatus.network = 0
          resolve(newStatus)
        }
      })
    }

    const newMetamaskStatus = await checkMetaMask()
    let isSigned = checkIsSigned(userData, newMetamaskStatus)

    if (
      newMetamaskStatus &&
      (newMetamaskStatus.status !== metamaskRedux.status ||
        newMetamaskStatus.isSigned !== isSigned ||
        newMetamaskStatus.account !== metamaskRedux.account)
    ) {
      newMetamaskStatus.isSigned = isSigned
      ReduxServices.callDispatchAction(PageReduxAction.setMetamask(newMetamaskStatus))
    }
  }

  static loginMetamask(showGetMetaMask, callback = null, callbackErr = null) {
    return new Promise(async (resolve) => {
      const signMetaMask = (callback = null) => {
        return new Promise(async (resolve, reject) => {
          try {
            const { metamaskRedux } = storeRedux.getState()
            const address = metamaskRedux.account
            let msgHash = 'Message hash'
            let content = await Web3Service.onMsgSign(address, msgHash)
            if (content && content.address && content.signature) {
              let newMetaMask = Object.assign({}, metamaskRedux)
              newMetaMask.isSigned = true
              this.callDispatchAction(PageReduxAction.setMetamask(newMetaMask))

              let newUserLogin = Object.assign(
                {},
                { address: content.address, sig: content.signature },
              )
              this.callDispatchAction(StorageActions.setUserData(newUserLogin))

              ReduxServices.refreshUser()
              callback && callback()
              return resolve()
            } else {
              showNotification('Please unlock your Metamask')
              this.callDispatchAction(StorageActions.setUserData({}))
              callbackErr && callbackErr()
              return resolve()
            }
          } catch (error) {
            showNotification('Please unlock your Metamask')
            reject(error)
          }
        })
      }

      const { metamaskRedux, locale, userData } = storeRedux.getState()
      let currentWeb3Inst = window.web3
      try {
        if (!isMobile && !isChrome && !isFirefox) {
          showNotification('Not Support')
          return resolve(null)
        }
        if (!currentWeb3Inst) {
          showGetMetaMask && showGetMetaMask()
          return resolve(null)
        }
        // Check if MetaMask is installed
        if (metamaskRedux.status === METAMASK.status.noWeb3) {
          showNotification('Please install Metamask')
          return resolve(null)
        }

        if (metamaskRedux.account) {
          let isSigned = checkIsSigned(userData, metamaskRedux)
          if (!isSigned) {
            signMetaMask(callback)
          } else {
            callback && callback()
            return resolve(null)
          }
        } else {
          this.onEnableMetaMask(() => signMetaMask(callback))
          return resolve(null)
        }
      } catch (error) {
        return resolve(error)
      }
    })
  }

  static async refreshUser() {
    const { userData, metamaskRedux } = storeRedux.getState()
    if (metamaskRedux.network === 0 && metamaskRedux.status !== METAMASK.status.loading) {
      ReduxServices.callDispatchAction(StorageActions.setUserData(null))
    } else {
      if (userData && userData.address) {
        ReduxServices.callDispatchAction(StorageActions.setUserData(userData))
      }
    }
  }
}
