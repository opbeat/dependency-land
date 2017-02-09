import React from 'react'
import { Link } from 'react-router'
import './style.css'

const SearchInfo = () => {
  return (
    <div className='ui two column grid SearchInfo'>
      <div className='ui four column centered row'>
        <div className='six wide column'>
          <b>Search for npm package dependents</b><br />
          Enter the name of any npm package name and an optional semver range below.
          Toggle to search devDependents.
        </div>
        <div className='six wide column'>
          <b>Try these examples:</b><br />
          <Link to='/level/0.10'>
            <code>level@0.10</code>
          </Link>
          &nbsp;or&nbsp;
          <Link to='/hypercore/^4.1'>
            <code>hypercore@^4.1</code>
          </Link>
          &nbsp;or&nbsp;
          <Link to='/standard/8.1.0?dev=1'>
            <code>standard@8.1.0</code>
          </Link>
          <br />
          <Link to='/array-flatten/~2.1'>
            <code>array-flatten@~2.1.0</code>
          </Link>
          &nbsp;or&nbsp;
          <Link to='/%40angular%2Frouter/3.1'>
            <code>@angular/router@3.1</code>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SearchInfo
