import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import App from './components/App';
import PackageSearch from './components/PackageSearch';
import NotFound from './components/NotFound';

const Routes = (props) => (
    <Router {...props}>
        <Route component={App}>
            <Route path="/" component={PackageSearch} />
            <Route path="/:package(/:version)" component={PackageSearch} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);

export default Routes;
