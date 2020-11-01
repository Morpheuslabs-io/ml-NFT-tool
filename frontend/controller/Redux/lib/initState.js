import { METAMASK } from 'common/constants'

var initState = {
  lang: 'en',
  userData: null,
  metamaskRedux: {
    isSigned: false,
    status: METAMASK.status.loading,
    network: 0,
    account: '',
  },
  isloading: true,
}

export default initState
