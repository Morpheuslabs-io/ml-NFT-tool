import React from 'react'
import Observer from 'common/observer'
import { OBSERVER } from 'common/constants'
import reactStringReplace from 'react-string-replace'

const SwitchNotification = (props) => {
  const { callback = null } = props

  const onLogin = () => {
    Observer.emit(OBSERVER.SIGN_IN, callback)
  }

  const showScreen = () => {
    return (
      <div>
        {reactStringReplace('Please sign in with the Metamask button above', '', (match, i) => (
          <span key={i} onClick={onLogin} className="text text-color-1 cursor pointer">
            {match}
          </span>
        ))}
      </div>
    )
  }

  return showScreen()
}

export default SwitchNotification
