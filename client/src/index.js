import initOpbeat from 'opbeat-react'
import 'opbeat-react/router'

import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'

import Routes from './routes'

import './semantic-ui/semantic.min.css'

let opbeatAppId = process.env.REACT_APP_OPBEAT_APP_ID
let opbeatOrgId = process.env.REACT_APP_OPBEAT_ORG_ID

if (process.env.NODE_ENV === 'production' && opbeatAppId && opbeatOrgId) {
  initOpbeat({
    appId: opbeatAppId,
    orgId: opbeatOrgId,
    performance: {
      'initial-page-load': true
    }
  })
}

ReactDOM.render(
  <Routes history={browserHistory} />,
  document.getElementById('root')
)
