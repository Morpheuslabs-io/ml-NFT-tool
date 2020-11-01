import { connect } from 'react-redux'
import { IntlProvider } from 'react-intl'

const mapStateToProps = (state) => ({
  locale: state.locale.lang,
  key: state.locale.lang,
})

export default connect(mapStateToProps)(IntlProvider)
