import fetch from 'isomorphic-fetch'

function search (query, range, dev, cb) {
  query = encodeURIComponent(query)
  range = encodeURIComponent(range)

  return fetch(`/api/query/${query}${range ? '/' : ''}${range}${dev ? '?dev=1' : ''}`, {
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
