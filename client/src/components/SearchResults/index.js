import React from 'react'

function SearchResults (props) {
  const {
    results,
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

  if (results === null) {
    return (
      <Message>
        Search for { searchValueForName || 'a package' }
        { searchValueForRange ? ('@' + searchValueForRange) : '' }
      </Message>
    )
  }

  if (results.length === 0) {
    return (
      <Message>
          No results found
      </Message>
    )
  }

  return (
    <div>
      {results.length > 0 ? <SearchResultsModules {...props} /> : null}
    </div>
  )
}

const Message = ({ children }) => (
  <h2 className='ui center disabled aligned icon header'>
    <i className='circular search icon' />
    {children}
  </h2>
)

function SearchResultsCount ({ results }) {
  if (!results) {
    return (
      <p>
        { ' '.replace(/ /g, '\u00a0') }
      </p>
    )
  } else {
    return (
      <p>
        Found <b>{results}</b> dependents:
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
      results,
      queryName
    } = this.props

    return (
      <div>
        <SearchResultsCount
          results={results.length}
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
              results.map((_package, idx) => (
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

export default SearchResults
