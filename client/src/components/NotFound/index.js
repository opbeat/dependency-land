import React, { Component } from 'react'
import classnames from 'classnames'

import './style.css'

export default class NotFound extends Component {
  render () {
    const { className } = this.props
    return (
      <div className={classnames('NotFound', className)}>
        <div className='ui vertical stripe center aligned segment'>
          <h1 className='ui icon header'>
            <i className='warning sign icon' />
            <div className='content'>
                Page not found
                <div className='sub header'>Please try a different page.</div>
            </div>
          </h1>
        </div>
      </div>
    )
  }
}
