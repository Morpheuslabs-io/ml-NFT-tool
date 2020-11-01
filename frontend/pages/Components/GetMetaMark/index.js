import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'next/router'
import './style.scss'

class GetMetaMask extends Component {
  render() {
    return (
      <div className="row text text-center get-metamask">
        <div className="text text-center">
          <p className="txt-wanna-title">Instructions</p>
          <p className="txt-wanna-content">Please register a Metamask account</p>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  locale: state.locale,
  userData: state.userData,
  metamaskRedux: state.metamaskRedux,
})

export default connect(mapStateToProps)(withRouter(GetMetaMask))
