import validator from 'validator'
import { KEY_STORE } from './constants'
import { notification } from 'antd'

export const saveDataLocal = (key, data) => {
  // eslint-disable-next-line no-undef
  localStorage.setItem(key, JSON.stringify(data))
}

export const getDataLocal = (key) => {
  // eslint-disable-next-line no-undef
  return JSON.parse(localStorage.getItem(key))
}

export const removeDataLocal = (key) => {
  // eslint-disable-next-line no-undef
  localStorage.removeItem(key)
}

/**
 *
 * @param {string} description
 * @param {string} title
 * @param {string} type success|error|info|warn|open|close| at https://ant.design/components/notification/
 */
export const showNotification = (title = null, description = '', type = 'open') => {
  notification[type]({
    message: title,
    description: description || '',
    placement: 'bottomRight',
    className: 'notification-class',
    bottom: 54,
    duration: 10,
  })
}

export const lowerCase = (value) => {
  return value ? value.toLowerCase() : value
}

export const upperCase = (value) => {
  return value ? value.toUpperCase() : value
}

export const getAuthKey = () => {
  let data = getDataLocal(KEY_STORE.SET_USER)
  return data ? data.sig + '|' + data.address : ''
}

export const isURL = (str) => {
  return validator.isURL(str)
}

export const checkIsSigned = (userData, metamaskRedux) => {
  if (userData && metamaskRedux) {
    return metamaskRedux.account.toLowerCase() === userData.address.toLowerCase()
  } else {
    return false
  }
}

export const convertAddressArrToString = (arrAddress, numStart = 10, numEnd = 4) => {
  if (arrAddress.length === 1) {
    return (
      arrAddress[0].substring(0, numStart) +
      '...' +
      arrAddress[0].substring(arrAddress[0].length - numEnd, arrAddress[0].length)
    )
  } else if (arrAddress.length > 1) {
    let stringTemp = ''
    arrAddress.map((item, index) => {
      index !== arrAddress.length - 1
        ? (stringTemp += convertAddressArrToString([item]) + '\n')
        : (stringTemp += convertAddressArrToString([item]))
    })
  }
}

export const scrollTop = () => {
  if (window) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
