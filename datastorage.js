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

  promises = fs.readdirAsync(directory).map(function(filename) {
    console.log('reading data from file:' + filename)
    return readFile(directory + '/' + filename)
  })

  return Promise.all(promises)
},

readWordFromCategory : function(category, word) {
  var path = DATADIR + category + '/' + word + '.json'
  console.log('Reading word using path: ' + path)
  return fs.readFileAsync(path, 'utf-8')
},

addWordsToCategory : function(category, words) {
  words.forEach( function(word) {
      var path = DATADIR + category + '/' + JSON.parse(word).word + '.json'
      fs.openAsync(path, 'w+').then(function(fd) {
        fs.write( fd, 'string to append to file', null, 'utf8', function() {
        fs.close(fd, function() {
          console.log('file closed');
        });
      })
  })
  })
}

}
