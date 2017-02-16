import React from 'react'
import { Link } from 'react-router'
import './style.css'

const SearchInfo = () => {
  return (
    <div className='ui two column doubling grid SearchInfo'>
      <div className='ui four column centered row'>
        <div className='six wide column'>
          <p>
            <b>Search for npm package dependents</b>
          </p>
          Enter the name of any npm package name and an optional semver range below.
          Toggle to search devDependents.
        </div>
        <div className='six wide column'>
          <p>
            <b>Try these examples</b>
          </p>
          <Link to='/level/0.10'>
            <code>level@0.10</code>
          </Link>

          <Link to='/hypercore/^4.1'>
            <code>hypercore@^4.1</code>
          </Link>

          <Link to='/standard/8.1.0?dev=1'>
            <code>standard@8.1.0</code>
          </Link>

          <Link to='/array-flatten/~2.1'>
            <code>array-flatten@~2.1.0</code>
          </Link>

          <Link to='/%40angular%2Frouter/3.1'>
            <code>@angular/router@3.1</code>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default SearchInfo
