import createReducer from '../lib/reducerConfig'
import { KEY_PAGE } from '../lib/constants'
import initState from '../lib/initState'

export const metamaskRedux = createReducer(initState.metamaskRedux, {
  [KEY_PAGE.SET_METAMASK_INFO](state, action) {
    return action.payload
  },
})
