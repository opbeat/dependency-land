import React, { Component } from 'react'
import { Link } from 'react-router'
import logo from './logo.svg'
import './style.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <Link to='/'>
            <img src={logo} className='App-logo' alt='logo' />
            <h1>Dependency.land <span>Beta</span></h1>
          </Link>
          <div className='App-repo'><i className='github icon' /> Contribute on <a href='https://github.com/opbeat/dependency-land' target='_blank'>GitHub</a></div>
          <div className='App-sponsor'><i className='heart icon' /> Community project by <a href='https://opbeat.com' target='_blank'>Opbeat</a></div>
        </div>
        <div className='ui container'>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default App
