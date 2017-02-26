import fetch from 'isomorphic-fetch'

function search (query, range, dev, cb) {
  return (limit = 50, gt) => {
    const _query = encodeURIComponent(query)
    const _range = encodeURIComponent(range)

    return fetch(withParamteres(`/api/query/${_query}${_range ? '/' : ''}${_range}`, [
      { name: 'dev', value: 1, condition: dev },
      { name: 'limit', value: limit },
      { name: 'gt', value: gt }
    ]), {
      accept: 'application/json'
    }).then(checkStatus)
      .then(parseJSON)
      .then(cb)
      .catch(function (err) {
        cb({
          error: true,
          message: err.message
        })
      })
  }
}

function withParamteres (path, parameters) {
  const condition = (val) => typeof val.condition === 'undefined'
    ? typeof val.value !== 'undefined'
      : val.condition

  return parameters.reduce((acc, val) =>
    condition(val)
      ? `${acc}${(acc.indexOf('?') === -1) ? '?' : '&'}${val.name}=${val.value}`
        : acc
  , path)
}

function checkStatus (response) {
  let ctHeader = response.headers.get('content-type')

  if (ctHeader && ctHeader.indexOf('application/json') !== 0) {
    throw new Error('Unexpected error occurred')
  }

  return response
}

function parseJSON (response) {
  return response.json()
}

const Client = {
  search
}

export default Client
