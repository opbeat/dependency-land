import React from 'react';
import Client from './Client';

const resetState = {
    total_packages_count: null,
    unique_packages_count: null,
    unique_packages: null,
    isLoading: false,
    errorMessage: '',
};

const PackageSearch = React.createClass({
    getInitialState: function () {
        let initialState = Object.assign({}, resetState, {
            searchValueForName: '',
            searchValueForRange: '',
        });

        let package_param = this.props.params.package;
        let version_param = this.props.params.version;

        if(package_param) {
            initialState['searchValueForName'] = package_param;
        }
        if(version_param) {
            initialState['searchValueForRange'] = version_param;
        }

        return initialState;
    },

    handleChangeForName: function (event) {
        const value = event.target.value;

        this.setState({
            searchValueForName: value,
        });
    },

    handleChangeForRange: function (event) {
        const value = event.target.value;

        this.setState({
            searchValueForRange: value,
        });
    },

    handleCancelForName: function (event) {
        this.setState({
            searchValueForName: '',
            searchValueForRange: ''
        }, () => {
            this.changeRoute()
        });
    },

    handleCancelForRange: function (event) {
        this.setState({
            searchValueForRange: ''
        }, () => {
            this.changeRoute()
        });
    },

    runSearch () {
        const {
            searchValueForName: name,
            searchValueForRange: range
        } = this.state

        if (name === '') {
            return false;
        }

        if (range === '') {
            this.setState({
                searchValueForRange: '*',
            })
        }

        this.setState({
            errorMessage: '',
            isLoading: true,
        });

        if (name) {
            Client.search(name, range, (result) => {
                if(result.error){
                    let errorState = Object.assign({}, resetState, {
                        errorMessage: result.message,
                    });

                    this.setState(errorState);
                } else {
                    this.setState({
                        total_packages_count: result.results.total_packages_count,
                        unique_packages_count: result.results.unique_packages_count,
                        unique_packages: result.results.unique_packages,
                        query_name: result.query.name,
                        isLoading: false,
                    });
                }
            });
        }
    },

    componentWillMount() {
        this.runSearch();
    },

    componentWillReceiveProps() {
        this.runSearch();
    },

    changeRoute(name = this.state.searchValueForName, range = this.state.searchValueForRange) {
        if (range === '*') {
            range = null;
        }

        // Construct route
        let route = `${name ? '/search/' : '/'}${name}${range ? '/' : ''}${range ? range : ''}`;

        // Change route
        this.props.router.push(route)
    },

    onSubmit: function (event) {
        event.preventDefault();

        const {
            searchValueForName: name
        } = this.state

        if (name === '') {
            this.setState({
                errorMessage: 'Enter a package name'
            });
            return false;
        }

        this.changeRoute();
    },
    render: function () {
        const { searchValueForName, searchValueForRange } = this.state

        return (
            <div className='PackageSearch'>
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
                <div className="ui hidden divider"></div>
                <div className="ui text container">
                    <form onSubmit={this.onSubmit} className="ui stackable grid">
                        <div className="eight wide column">

                            <div className="ui labeled input SearchInputName">
                                <div className="ui label">
                                package
                                </div>
                                <input
                                    type="text"
                                    className='prompt'
                                    value={searchValueForName}
                                    onChange={ this.handleChangeForName }
                                    placeholder='Eg. hypercore'
                                    autoFocus
                                    />
                                {
                                    searchValueForName.length > 0 ? (
                                        <i
                                            className='remove icon link'
                                            onClick={ this.handleCancelForName }
                                            />
                                    ) : ''
                                }
                            </div>
                        </div>

                        <div className="eight wide column">
                            <div className="ui labeled input SearchInputRange">

                                <div className="ui label">
                                range
                                </div>
                                <input
                                    type="text"
                                    className='prompt'
                                    value={searchValueForRange}
                                    onChange={ this.handleChangeForRange }
                                    placeholder='Eg. ^1.2.3'
                                    />
                                {
                                    searchValueForRange.length > 0 ? (
                                        <i
                                            className='remove icon link'
                                            onClick={ this.handleCancelForRange }
                                            />
                                    ) : ''
                                }
                            </div>

                            <button
                                type="submit"
                                className="ui column large teal button"
                                >
                                Search
                            </button>
                        </div>
                    </form>
                </div>
                <div className="ui hidden divider"></div>
                <div className="ui container ResultsContainer">
                    { this.state.isLoading ? (
                        <div className="ui active inverted dimmer">
                            <div className="ui medium text loader">Loading</div>
                        </div>
                    ) : null}
                    <SearchResults {...this.state} />
                </div>
            </div>
        );
    },
});


function SearchResults(props) {
    const {
        unique_packages,
        searchValueForName,
        searchValueForRange,
        errorMessage,
    } = props

    if (errorMessage.length > 0) {
        return (
            <h2 className="ui center disabled aligned icon header">
                <i className="circular warning sign icon"></i>
                Error:
                <p>
                    <small>"{ errorMessage }"</small>
                </p>
            </h2>
        )
    }

    if (unique_packages === null) {
        return (
            <Message>
                Search for { searchValueForName ? searchValueForName : 'a package'}
                { searchValueForRange ? ('@' + searchValueForRange) : ''}
            </Message>
        )
    }

    if (unique_packages.length === 0) {
        return (
            <Message>
                No results found
            </Message>
        )
    }

    return (
        <div>
            {unique_packages.length > 0 ? <SearchResultsModules {...props} /> : null}
        </div>
    )
}


const Message = ({ children }) => (
    <h2 className="ui center disabled aligned icon header">
        <i className="circular search icon"></i>
        {children}
    </h2>
)


function SearchResultsCount({ totalCount, uniqueCount }) {
    if(!totalCount && !uniqueCount) {
        return (
            <p>
                { ' '.replace(/ /g, "\u00a0") }
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
    shouldComponentUpdate(nextProps) {
        return (
            nextProps.query_name !== this.props.query_name
        )
    }

    render() {
        const {
            total_packages_count,
            unique_packages_count,
            unique_packages,
            query_name,
        } = this.props

        return (
            <div>
                <SearchResultsCount
                    totalCount={total_packages_count}
                    uniqueCount={unique_packages_count}
                />
                <table className='ui selectable structured large table'>
                    <thead className='left'>
                        <tr>
                            <th className='six wide'>Dependent package name</th>
                            <th>Latest dependent version</th>
                            <th>Range for <i>{ query_name }</i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            unique_packages.map((_package, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <a
                                            href={ 'https://www.npmjs.com/package/' + _package.name }
                                            target="_blank"
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

export default PackageSearch;
