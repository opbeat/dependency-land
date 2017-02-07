/* eslint-disable no-undef */
function search (query, range, cb) {
  query = encodeURIComponent(query)
  range = encodeURIComponent(range)

  return fetch(`/api/query/${query}${range ? '/' : ''}${range}`, {
    accept: 'application/json'
  }).then(checkStatus)
      .then(parseJSON)
      .then(cb)
}

function checkStatus (response) {
    // if (response.status >= 200 && response.status < 300) {
    //     return response
    // } else {
    //     const error = new Error(`HTTP Error ${response.statusText}`)
    //     error.status = response.statusText
    //     error.response = response
    //     console.log(error) // eslint-disable-line no-console
    //     throw error
    // }
  return response
}

function parseJSON (response) {
  return response.json()
}

const Client = {
  search
}
export default Client
