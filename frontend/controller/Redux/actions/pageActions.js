import { KEY_PAGE } from '../lib/constants'

export default class PageReduxAction {
  static setMetamask(payload) {
    return {
      type: KEY_PAGE.SET_METAMASK_INFO,
      payload,
    }
  }
}
