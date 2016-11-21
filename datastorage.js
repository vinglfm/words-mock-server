var DATADIR = __dirname + '/data/'
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))

var data = ['{}']

module.exports = {

readCategoryWords : function(category) {
  var directory = DATADIR+category

  if (category === 'default') {
    console.log('inside if')
      category = DATADIR
  }

  var promises = [];

  var readFile = function(path) {
    return fs.readFileAsync(path, 'utf-8')
  }

var i = 0;
  promises = fs.readdirAsync(directory).map(function(filename) {
    console.log('reading data from file:' + filename)
    return readFile(directory + '/' + filename)
  })

  return Promise.all(promises)
}

}
