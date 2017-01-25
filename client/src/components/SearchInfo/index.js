import React from 'react';
import { Link } from 'react-router';

const SearchInfo = () => {

    return (
        <div className="ui text container">
            <div className="ui stackable grid">
                <div className="eight wide column">
                    <b>Search for npm package dependents</b><br/>
                    Enter the name of any npm package name <br/> and an optional semver range below.
                </div>
                <div className="eight wide column">
                    <b>Try these examples:</b><br/>
                    <Link to="/search/level/0.10.0">
                        <code>level@0.10.0</code>
                    </Link>
                    &nbsp;or&nbsp;
                    <Link to="/search/hypercore/^4.1.0">
                        <code>hypercore@^4.1.0</code>
                    </Link>
                    <br/>
                    <Link to="/search/standard">
                        <code>standard@*</code>
                    </Link>
                    &nbsp;or&nbsp;
                    <Link to="/search/array-flatten/~2.1">
                        <code>array-flatten@~2.1</code>
                    </Link>
                </div>
            </div>
        </div>
    );

};

export default SearchInfo;
