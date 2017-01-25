import React from 'react';
import { Router, Route, IndexRedirect } from 'react-router';

import App from './components/App';
import PackageSearch from './components/PackageSearch';
import NotFound from './components/NotFound';

const Routes = (props) => (
    <Router {...props}>
        <Route path="/" component={App}>
            <IndexRedirect to="/search" />
            <Route path="/search" component={PackageSearch} />
            <Route path="/search/:package(/:version)" component={PackageSearch} />
            <Route path="*" component={NotFound} />
        </Route>
    </Router>
);

export default Routes;
