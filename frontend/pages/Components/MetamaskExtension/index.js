import React, { Component } from 'react'
import { connect } from 'react-redux'
import './style.scss'

class MetamaskExtensionHelp extends Component {
  render() {
    return (
      <div>
        <div className="row  text text-center metamask-extension">
          <div className="text text-center bottom-content" style={{ height: '30%' }}>
            <p className="txt-wanna-title MT10">Sign in Metamask</p>
            <p className="txt-wanna-content">Open the in-browser Metamask extension</p>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  locale: state.locale,
  userData: state.userData,
})

export default connect(mapStateToProps)(MetamaskExtensionHelp)
