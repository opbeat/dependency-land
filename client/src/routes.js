import React from 'react';
import { Router, Route } from 'react-router';

import App from './components/App';
import PackageSearch from './components/PackageSearch';
import NotFound from './components/NotFound';

function handleUpdate() {
    // Basic GA tracking
    if(window.ga){
        window.ga('set', 'page', window.location.pathname);
        window.ga('send', 'pageview');
    }
}

function forceTrailingSlash(nextState, replace) {
    const path = nextState.location.pathname;
    if (path.slice(-1) !== '/') {
        replace({
            ...nextState.location,
            pathname: path + '/'
        });
    }
}

function forceTrailingSlashOnChange(prevState, nextState, replace) {
    forceTrailingSlash(nextState, replace);
}

const Routes = (props) => (
    <Router {...props} onUpdate={handleUpdate} >
        <Route component={App} onEnter={forceTrailingSlash} onChange={forceTrailingSlashOnChange}>
            <Route path="/" component={PackageSearch} />
            <Route path="/:package(/:version)" component={PackageSearch} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);

export default Routes;
