import React from 'react'
import ReduxServices from 'common/redux'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { images } from 'config/images'
import './style.scss'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import StorageAction from 'controller/Redux/actions/storageActions'
import { checkIsSigned, convertAddressArrToString } from 'common/function'
import { OBSERVER, LINK_METAMASK } from 'common/constants'
import { withRouter } from 'next/router'
import { Layout, Button } from 'antd'
import GetMetaMask from 'pages/Components/GetMetaMark'
import MetamaskExtension from 'pages/Components/MetamaskExtension'
import { isFirefox } from 'react-device-detect'
import Observer from 'common/observer'
import Web3Service from 'controller/Web3'

class Header extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
    this.myModal = React.createRef()
  }

  // componentDidMount() {
  //   Observer.on(OBSERVER.SIGN_IN, this.handleSignIn)
  // }

  // componentWillUnmount() {
  //   Observer.removeListener(OBSERVER.SIGN_IN, this.handleSignIn)
  // }

  closeModal = () => {
    this.myModal.current.closeModal()
  }

  onOpenPlugin = () => {
    this.myModal.current.openModal(<MetamaskExtension closeModal={this.closeModal} />)
    window.open(isFirefox ? LINK_METAMASK.FIREFOX : LINK_METAMASK.CHROME, '_blank')
  }

  onShowModalGetMetaMask = () => {
    this.myModal.current.openModal(
      <GetMetaMask closeModal={this.closeModal} onOpenPlugin={this.onOpenPlugin} />,
    )
  }

  callbackSignIn = () => {
    Observer.emit(OBSERVER.ALREADY_SIGNED)
  }

  handleSignIn = async () => {
    if (window.ethereum) {
      // const web3 = new Web3(window.ethereum)
      const web3 = Web3Service.getWeb3()

      // fetch accounts
      window.ethereum.enable().then((accounts) => {
        // web3.eth.net.getId().then((id) => {
        //   console.log('id:', id)
        //   this.setState({
        //     network: id === MATIC_NETWORK.id || id === MATIC_NETWORK.idMainnet ? 'MATIC' : 'ETH',
        //   })
        // })

        const address = accounts[0]
        const toChecksumAddress = web3.utils.toChecksumAddress

        window.ethereum.on('accountsChanged', (e) => {
          console.log('accountsChanged - toChecksumAddress(e[0]):', toChecksumAddress(e[0]))
          if (address) {
            const accountChanged = !(toChecksumAddress(e[0]) === toChecksumAddress(address))
            if (accountChanged) {
              window.location.reload()
            }
          }
        })

        window.ethereum.on('networkChanged', () => {
          console.log('networkChanged')
          window.location.reload()
        })
      })
    }
  }

  // handleSignIn = (callback = null, callbackErr = null) => {
  //   ReduxServices.loginMetamask(
  //     this.onShowModalGetMetaMask,
  //     callback || this.callbackSignIn,
  //     callbackErr,
  //   )
  // }

  renderLeftSide() {
    return (
      <div className="left-side">
        <h1 className="logo">
          <a target="_blank" href="https://morpheuslabs.io/">
            <img
              style={{ cursor: 'pointer' }}
              src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuMiwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA4MCA2MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgODAgNjA7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZmlsbDojRkZGRkZGO3N0cm9rZTp1cmwoI1NWR0lEXzFfKTtzdHJva2Utd2lkdGg6My4wNDI7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQo8L3N0eWxlPgo8dGl0bGU+aGVnaW9uLW5hdi1sb2dvLW1vcnBoZXVzPC90aXRsZT4KPGxpbmVhckdyYWRpZW50IGlkPSJTVkdJRF8xXyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIwLjQ3OSIgeTE9IjE2Ni42MDYxIiB4Mj0iNzkuNTIxIiB5Mj0iMTY2LjYwNjEiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSAwIC0xMzgpIj4KCTxzdG9wICBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MzUzRDkiLz4KCTxzdG9wICBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MzUzRDkiLz4KPC9saW5lYXJHcmFkaWVudD4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTY4LjUsMjIuM1YxMS44TDU4LjIsNi4yTDQ4LDExLjh2MTEuNWwtOCw0LjZsLTcuOS00LjZWMTEuOEwyMS44LDYuMmwtMTAuMiw1LjZ2MTAuNEwyLDI3LjV2MTEuM2wxMC4yLDYKCUwyMi41LDM5VjI4LjdsNy42LTQuM2w4LjEsNC42bC04LjUsNC45djExLjJMNDAsNTFsMTAuMy01LjdWMzMuOGwtOC41LTQuOWw4LjEtNC41bDcuNiw0LjNWMzlsMTAuMyw1LjdsMTAuMS02VjI3LjVMNjguNSwyMi4zegoJIE0yMC45LDM4bC04LjcsNC44bC04LjYtNS4xdi05LjNsOC43LTQuN2w2LjIsMy40bDIuNSwxLjRWMzhIMjAuOXogTTMwLjUsMjIuNGwtOC42LDQuOGwtMi42LTEuNGwtNi4xLTMuNnYtOS40TDIxLjgsOGw4LjcsNC43CglWMjIuNHogTTQ4LjcsMzQuOHY5LjZMNDAsNDkuMmwtOC42LTUuMXYtOS40TDQwLDMwTDQ4LjcsMzQuOHogTTQ5LjYsMjIuNHYtOS42TDU4LjIsOGw4LjcsNC43djkuNGwtNi4xLDMuNmwwLDBsLTIuNiwxLjRMNDkuNiwyMi40Cgl6IE03Ni41LDM3LjhsLTguNiw1LjFsLTguNy00Ljh2LTkuNWwyLjUtMS40bDYuMi0zLjRsOC43LDQuOEw3Ni41LDM3LjhMNzYuNSwzNy44eiIvPgo8L3N2Zz4K"
              alt="Morpheus Labs"
            ></img>
          </a>
        </h1>
      </div>
    )
  }

  renderDesktop() {
    const { userData, metamaskRedux } = this.props
    let isSigned = checkIsSigned(userData, metamaskRedux)
    return (
      <React.Fragment>
        {this.renderLeftSide()}
        {/* <div className="right-side">
          <div className="ctn-btn-signin">
            {isSigned ? (
              <React.Fragment>
                <span className="user-address">
                  {convertAddressArrToString([userData.address])}
                </span>
                <Jazzicon diameter={40} seed={jsNumberForAddress(userData.address)} />
              </React.Fragment>
            ) : (
              <Button className="btn-signin" onClick={() => this.handleSignIn()}>
                <img src={images.metamask} width="30px" />
              </Button>
            )}
          </div>
        </div> */}
      </React.Fragment>
    )
  }
  render() {
    return <Layout.Header className="header-container">{this.renderDesktop()} </Layout.Header>
  }
}
const mapStateToProps = (state) => ({
  locale: state.locale,
  userData: state.userData,
  metamaskRedux: state.metamaskRedux,
})
const mapDispatchToProps = (dispatch) => {
  return {
    setLocale: bindActionCreators(StorageAction.setLocale, dispatch),
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
