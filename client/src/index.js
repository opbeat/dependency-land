import initOpbeat from 'opbeat-react';
import 'opbeat-react/router';

import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import Routes from './routes';

import './semantic-ui/semantic.min.css';

let opbeat_app_id = process.env.REACT_APP_OPBEAT_APP_ID;
let opbeat_org_id = process.env.REACT_APP_OPBEAT_ORG_ID;

if(process.env.NODE_ENV === 'production' && opbeat_app_id && opbeat_org_id) {
    initOpbeat({
        appId: opbeat_app_id,
        orgId: opbeat_org_id,
        performance: {
            'initial-page-load': true
        },
    });
}

ReactDOM.render(
    <Routes history={browserHistory} />,
    document.getElementById('root')
);
