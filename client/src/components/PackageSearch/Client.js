import fetch from 'isomorphic-fetch'

function serialize (obj) {
  let str = []
  for (let property in obj) {
    if (obj.hasOwnProperty(property)) {
      str.push(encodeURIComponent(property) + '=' + encodeURIComponent(obj[property]))
    }
  }
  return str.join('&')
}

function search (query, range, dev, limit, gt, cb) {
  query = encodeURIComponent(query)
  range = encodeURIComponent(range)

  const options = Object.assign({}, { limit: -1 }, {limit, gt})

  if (dev) {
    options.dev = 1
  }

  return fetch(`/api/query/${query}${range ? '/' : ''}${range}?${serialize(options)}`, {
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
