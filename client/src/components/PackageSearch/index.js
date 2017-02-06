import React from 'react';
import Client from './Client';
import ReactDOM from 'react-dom';

import SearchInfo from '../SearchInfo';

const resetState = {
    total_packages_count: null,
    unique_packages_count: null,
    unique_packages: null,
    isLoading: false,
    errorMessage: '',
};

const PackageSearch = React.createClass({
    getResetState(name, range) {
        let state = Object.assign({}, resetState, {});

        if (name) {
            state['searchValueForName'] = name;
        } else {
            state['searchValueForName'] = '';
        }

        if (range) {
            state['searchValueForRange'] = range;
        } else {
            if (name) {
                state['searchValueForRange'] = '*';
            } else {
                state['searchValueForRange'] = '';
            }
        }

        return state;
    },

    getInitialState() {
        let package_param = this.props.params.package;
        let version_param = this.props.params.version;

        let newState = this.getResetState(package_param, version_param);

        return newState;
    },

    handleChangeForName(event) {
        const value = event.target.value;

        this.setState({
            searchValueForName: value,
        });
    },

    handleChangeForRange(event) {
        const value = event.target.value;

        this.setState({
            searchValueForRange: value,
        });
    },

    handleCancelForName(event) {
        let newState = this.getResetState();

        this.setState(newState, () => {
            this.changeRoute();
            ReactDOM.findDOMNode(this.refs.nameInput).focus();
        });
    },

    handleCancelForRange(event) {
        this.setState({
            searchValueForRange: '',
        }, () => {
            ReactDOM.findDOMNode(this.refs.rangeInput).focus();
        });
    },

    runSearch(name = this.state.searchValueForName, range = this.state.searchValueForRange) {
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

        Client.search(name, range, (result) => {
            if (result.error) {
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
    },

    componentWillReceiveProps(nextProps) {
        // Run search if new params are different from current ones
        let package_param = nextProps.params.package;
        let version_param = nextProps.params.version;

        let newState = this.getResetState(package_param, version_param);

        this.setState(newState, () => {
            this.runSearch(package_param, version_param);
        });
    },

    componentWillMount() {
        // Run search when mounting component
        // eg. when hitting a deep link
        if (this.props.params.package || this.props.params.version) {
            this.runSearch();
        }
    },

    changeRoute(name = this.state.searchValueForName, range = this.state.searchValueForRange) {
        // Construct route
        let route = ``;

        name = encodeURIComponent(name);

        if (name && name !== '' && name !== null) {
            route = `/${name}`
        }

        if (name && range) {
            route = `${route}/${range}`
        } else if (name) {
            route = `${route}/*`
        }

        // Change route
        this.props.router.push(route);
    },

    onSubmit(event) {
        event.preventDefault();

        if (this.state.searchValueForName === '') {
            this.setState({
                errorMessage: 'Enter a package name'
            });
            return false;
        }

        this.changeRoute(
            this.state.searchValueForName.toLowerCase(),
            this.state.searchValueForRange.toLowerCase()
        );
    },

    render () {
        const { searchValueForName, searchValueForRange } = this.state

        return (
            <div className='PackageSearch'>
                <SearchInfo />
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
                                    ref="nameInput"
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
                                    ref="rangeInput"
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
