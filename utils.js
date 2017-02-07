/* global env */
global.env = process.env.NODE_ENV || 'development'

exports.isDevelopment = function () {
  if (env === 'development') {
    return true
  } else {
    return false
  }
}

exports.log = function () {
  let args = Array.prototype.slice.call(arguments)
  let date = new Date()
  args.unshift(date + ' | [Dependency.land] ')
  console.log.apply(console, args)
}
