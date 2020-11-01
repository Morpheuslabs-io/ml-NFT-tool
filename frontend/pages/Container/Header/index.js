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

class Header extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
    this.myModal = React.createRef()
  }

  componentDidMount() {
    Observer.on(OBSERVER.SIGN_IN, this.handleSignIn)
  }

  componentWillUnmount() {
    Observer.removeListener(OBSERVER.SIGN_IN, this.handleSignIn)
  }

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

  handleSignIn = (callback = null, callbackErr = null) => {
    this.closeDrawer()
    ReduxServices.loginMetamask(
      this.onShowModalGetMetaMask,
      callback || this.callbackSignIn,
      callbackErr,
    )
  }

  renderLeftSide() {
    return (
      <div className="left-side">
        <h1 className="logo">
          <a target="_blank" href="https://morpheuslabs.io/">
            <img style={{ cursor: 'pointer' }} src={images.logoHeader} />
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
        <div className="right-side">
          <div className="ctn-btn-signin">
            {isSigned ? (
              <React.Fragment>
                <span className="user-address">
                  {convertAddressArrToString([userData.address])}
                </span>
                <Jazzicon diameter={30} seed={jsNumberForAddress(userData.address)} />
              </React.Fragment>
            ) : (
              <Button className="btn-signin" onClick={() => this.handleSignIn()}>
                <img src={images.metamask} width="30px" />
              </Button>
            )}
          </div>
        </div>
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
