import React, {PropTypes} from 'react';

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
              <code>level@0.10.0</code> or <code>hypercore@^4.1.0</code><br/>
              <code>standard@*</code> or <code>array-flatten@~2.1</code>
              </div>
          </div>
      </div>
  );
};

export default SearchInfo;
