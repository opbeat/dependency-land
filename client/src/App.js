import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import PackageSearch from './PackageSearch';

class App extends Component {
  render() {
    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1>ModuleVersions <span>Beta</span></h1>
                <div className="App-repo"><i className="github icon"></i> Contribute on <a href="https://github.com/opbeat/module-versions" target="_blank">GitHub</a></div>
                <div className="App-sponsor"><i className="heart icon"></i> Community project by <a href="https://opbeat.com" target="_blank">Opbeat</a></div>
            </div>
            <div className="ui container">
                <div className="ui text container">
                    <div className="ui stackable grid">
                        <div className="eight wide column">
                        <b>Search for npm package dependents</b><br/>
                        Enter the name of any npm package name <br/> and an optional semver range below.
                        </div>
                        <div className="eight wide column">
                        <b>Try these examples:</b><br/>
                        <code>level@0.10.0</code> or <code>hypercore@^4.1.0</code><br/>
                        <code>standard@*</code> or <code>array-flatten@~2.1</code>
                        </div>
                    </div>
                </div>
                <PackageSearch />
            </div>
        </div>
    );
  }
}

export default App;
