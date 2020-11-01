import React from 'react'
import ReduxServices from 'common/redux'
import App from 'next/app'
import { Provider } from 'react-redux'
import Head from 'next/head'
import ReduxConnectIntl from 'config/lang'
import { addLocaleData } from 'react-intl'
import intlEN from 'react-intl/locale-data/en'
import store from 'controller/Redux/store/configureStore'
import storageActions from 'controller/Redux/actions/storageActions'
import init from 'controller/Redux/lib/initState'
import { checkLocalStoreToRedux } from 'controller/Redux/lib/reducerConfig'
import BaseContainer from 'pages/Container'
import { images } from 'config/images'
import Observer from 'common/observer'
import { OBSERVER, KEY_STORE } from 'common/constants'
import { Spin } from 'antd'
import './Style/override.less'
import './Style/global.scss'
addLocaleData([...intlEN])

class MyApp extends App {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: true,
    }
    this.currentInterval = null
  }

  async componentDidMount() {
    try {
      this.currentInterval = setTimeout(() => {
        ReduxServices.refreshMetaMask()
      }, 500)
      const ethererum = window.web3
      if (ethererum) {
        ethererum.currentProvider.on('accountsChanged', function (accounts) {
          ReduxServices.refreshMetaMask()
          Observer.emit(OBSERVER.CHANGED_ACCOUNT)
        })
        ethererum.currentProvider.on('networkChanged', function (accounts) {
          ReduxServices.refreshMetaMask()
        })
      }
      const storageRedux = [
        {
          key: KEY_STORE.SET_LOCALE,
          action: storageActions.setLocale,
          init: init.lang,
        },
        {
          key: KEY_STORE.SET_USER,
          action: storageActions.setUserData,
          init: init.userData,
        },
      ]

      const promiseArr = storageRedux.map((item) => {
        checkLocalStoreToRedux(store, item.key, item.action, item.init)
      })
      await Promise.all(promiseArr)
      ReduxServices.onEnableMetaMask()

      const initDataPromiseArr = [ReduxServices.refreshUser()]

      Promise.all(initDataPromiseArr)

      // in the case reload page: need to wait for metamask already in use before showing page
      // await ReduxServices.waitForRefreshMetaMask()
    } finally {
      this.setState({
        isLoading: false,
      })
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Provider store={store}>
        <Head>
          <title>NFT</title>
          <meta charSet="utf-8" />
          <link rel="shortcut icon" href={images.favicon} />
          <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
          <meta httpEquiv="Pragma" content="no-cache" />
          <meta httpEquiv="Expires" content="0" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no"
          />
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="" />
        </Head>
        {this.state.isLoading ? (
          <div className="loading-container">
            <Spin size="large" />
          </div>
        ) : (
          <ReduxConnectIntl>
            <BaseContainer>
              <Component {...pageProps} />
            </BaseContainer>
          </ReduxConnectIntl>
        )}
      </Provider>
    )
  }
}

export default MyApp
