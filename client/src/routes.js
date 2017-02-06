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

const Routes = (props) => (
        <Route component={App}>
    <Router {...props} onUpdate={handleUpdate} >
            <Route path="/" component={PackageSearch} />
            <Route path="/:package(/:version)" component={PackageSearch} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);

export default Routes;
