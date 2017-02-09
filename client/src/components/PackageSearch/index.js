/* eslint no-unneeded-ternary: "error" */
import React from 'react'
import Client from './Client'
import ReactDOM from 'react-dom'
import classnames from 'classnames'

import SearchInfo from '../SearchInfo'

import './style.css'

const resetState = {
  totalPackagesCount: null,
  uniquePackagesCount: null,
  uniquePackages: null,
  isLoading: false,
  errorMessage: ''
}

const PackageSearch = React.createClass({
  getResetState (name, range, dev) {
    let state = Object.assign({}, resetState, {})

    if (name) {
      state['searchValueForName'] = name
    } else {
      state['searchValueForName'] = ''
    }

    if (range) {
      state['searchValueForRange'] = range
    } else {
      if (name) {
        state['searchValueForRange'] = '*'
      } else {
        state['searchValueForRange'] = ''
      }
    }

    dev = Boolean(dev)

    if (dev) {
      state['searchDev'] = true
    } else {
      state['searchDev'] = false
    }

    return state
  },

  getInitialState () {
    let packageParam = this.props.params.package
    let versionParam = this.props.params.version
    let devParam = this.props.location.query.dev

    let newState = this.getResetState(packageParam, versionParam, devParam)

    return newState
  },

  handleChangeForName (event) {
    const value = event.target.value

    this.setState({
      searchValueForName: value
    })
  },

  handleChangeForRange (event) {
    const value = event.target.value

    this.setState({
      searchValueForRange: value
    })
  },

  handleCancelForName (event) {
    let newState = this.getResetState()

    this.setState(newState, () => {
      this.changeRoute()
      ReactDOM.findDOMNode(this.refs.nameInput).focus()
    })
  },

  handleCancelForRange (event) {
    this.setState({
      searchValueForRange: ''
    }, () => {
      ReactDOM.findDOMNode(this.refs.rangeInput).focus()
    })
  },

  handleCheckboxChange (event) {
    this.setState({
      searchDev: event.target.checked
    })
  },

  runSearch (
    name = this.state.searchValueForName,
    range = this.state.searchValueForRange,
    dev = this.state.searchDev
  ) {
    if (name === '') {
      return false
    }

    if (range === '') {
      this.setState({
        searchValueForRange: '*'
      })
    }

    dev = Boolean(dev)

    this.setState({
      errorMessage: '',
      isLoading: true
    })

    Client.search(name, range, dev, (result) => {
      if (result.error) {
        let errorState = Object.assign({}, resetState, {
          errorMessage: result.message
        })

        this.setState(errorState)
      } else {
        this.setState({
          totalPackagesCount: result.results.total_packages_count,
          uniquePackagesCount: result.results.unique_packages_count,
          uniquePackages: result.results.unique_packages,
          queryName: result.query.name,
          isLoading: false
        })
      }
    })
  },

  componentWillReceiveProps (nextProps) {
    // Run search if new params are different from current ones
    let packageParam = nextProps.params.package
    let versionParam = nextProps.params.version
    let devParam = nextProps.location.query.dev

    let newState = this.getResetState(packageParam, versionParam, devParam)

    this.setState(newState, () => {
      this.runSearch(packageParam, versionParam, devParam)
    })
  },

  componentWillMount () {
    // Run search when mounting component
    // eg. when hitting a deep link
    if (this.props.params.package || this.props.params.version) {
      this.runSearch()
    }
  },

  changeRoute (
      name = this.state.searchValueForName,
      range = this.state.searchValueForRange,
      dev = this.state.searchDev
  ) {
    // Construct route
    let route = ``

    name = encodeURIComponent(name)

    if (name && name !== '' && name !== null) {
      route = `/${name}`
    }

    if (name && range) {
      route = `${route}/${range}`
    } else if (name) {
      route = `${route}/*`
    }

    if (dev) {
      route = `${route}?dev=1`
    }

    // Change route
    this.props.router.push(route)
  },

  onSubmit (event) {
    event.preventDefault()

    if (this.state.searchValueForName === '') {
      this.setState({
        errorMessage: 'Enter a package name'
      })
      return false
    }

    this.changeRoute(
      this.state.searchValueForName,
      this.state.searchValueForRange,
      this.state.searchDev
    )
  },

  render () {
    const { searchValueForName, searchValueForRange } = this.state
    const showClearIconForName = searchValueForName.length > 0
    const showClearIconForRange = searchValueForRange.length > 0
    const searchInputNameClass = classnames('ui', 'labeled', 'input', 'SearchInputName', {
      'icon': showClearIconForName
    })
    const searchInputRangeClass = classnames('ui', 'labeled', 'input', 'SearchInputRange', {
      'icon': showClearIconForRange
    })

    return (
      <div className='PackageSearch'>
        <SearchInfo />

        <div className='ui two column grid SearchForm'>
          <form onSubmit={this.onSubmit} className='ui four column centered row'>

            <div className='ui six wide column'>
              <div className={searchInputNameClass}>
                <div className='ui label'>
                  package
                </div>
                <input
                  type='text'
                  className='prompt'
                  value={searchValueForName}
                  onChange={this.handleChangeForName}
                  placeholder='Eg. hypercore'
                  ref='nameInput'
                  autoFocus
                />
                {
                  showClearIconForName ? (
                    <i
                      className='remove icon link'
                      onClick={this.handleCancelForName}
                    />
                  ) : ''
                }
              </div>
            </div>

            <div className='ui six wide column'>
              <div className={searchInputRangeClass}>
                <div className='ui label'>
                range
                </div>
                <input
                  type='text'
                  className='prompt'
                  value={searchValueForRange}
                  onChange={this.handleChangeForRange}
                  placeholder='Eg. ^1.2.3'
                  ref='rangeInput'
                />
                {
                  showClearIconForRange ? (
                    <i
                      className='remove icon link'
                      onClick={this.handleCancelForRange}
                    />
                  ) : ''
                }
              </div>

              <div
                className='ui fitted large toggle checkbox'
                data-tooltip='Search for devDependents'
                data-inverted=''
              >
                <input
                  type='checkbox'
                  checked={this.state.searchDev}
                  onChange={this.handleCheckboxChange}
                />
                <label />
              </div>

              <button
                type='submit'
                className='ui column large teal button'
                >
                Search
              </button>
            </div>

          </form>
        </div>

        <div className='ui hidden divider' />
        <div className='ui container ResultsContainer'>
          { this.state.isLoading ? (
            <div className='ui active inverted dimmer'>
              <div className='ui medium text loader'>
                <b>Loading</b>
                <p>
                  Searching for popular modules may take a while.
                </p>
              </div>
            </div>
          ) : null}
          <SearchResults {...this.state} />
        </div>
      </div>
    )
  }
})

function SearchResults (props) {
  const {
    uniquePackages,
    searchValueForName,
    searchValueForRange,
    errorMessage
  } = props

  if (errorMessage.length > 0) {
    return (
      <h2 className='ui center disabled aligned icon header'>
        <i className='circular warning sign icon' />
        Error:
        <p>
          <small>"{ errorMessage }"</small>
        </p>
      </h2>
    )
  }

  if (uniquePackages === null) {
    return (
      <Message>
        Search for { searchValueForName || 'a package' }
        { searchValueForRange ? ('@' + searchValueForRange) : '' }
      </Message>
    )
  }

  if (uniquePackages.length === 0) {
    return (
      <Message>
          No results found
      </Message>
    )
  }

  return (
    <div>
      {uniquePackages.length > 0 ? <SearchResultsModules {...props} /> : null}
    </div>
  )
}

const Message = ({ children }) => (
  <h2 className='ui center disabled aligned icon header'>
    <i className='circular search icon' />
    {children}
  </h2>
)

function SearchResultsCount ({ totalCount, uniqueCount }) {
  if (!totalCount && !uniqueCount) {
    return (
      <p>
        { ' '.replace(/ /g, '\u00a0') }
      </p>
    )
  } else {
    return (
      <p>
        Found <b>{totalCount}</b> dependent package releases.
        Filtered down to <b>{uniqueCount}</b> unique packages:
      </p>
    )
  }
}

class SearchResultsModules extends React.Component {
  shouldComponentUpdate (nextProps) {
    return (
      nextProps.queryName !== this.props.queryName
    )
  }

  render () {
    const {
      totalPackagesCount,
      uniquePackagesCount,
      uniquePackages,
      queryName
    } = this.props

    return (
      <div>
        <SearchResultsCount
          totalCount={totalPackagesCount}
          uniqueCount={uniquePackagesCount}
        />
        <table className='ui selectable structured large table'>
          <thead className='left'>
            <tr>
              <th className='six wide'>Dependent package name</th>
              <th>Latest dependent version</th>
              <th>Range for <i>{ queryName }</i></th>
            </tr>
          </thead>
          <tbody>
            {
              uniquePackages.map((_package, idx) => (
                <tr key={idx}>
                  <td>
                    <a
                      href={'https://www.npmjs.com/package/' + _package.name}
                      target='_blank'
                    >
                      {_package.name}
                    </a>
                  </td>
                  <td className='left aligned'>{_package.version}</td>
                  <td className='left aligned'>{_package.range}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default PackageSearch
