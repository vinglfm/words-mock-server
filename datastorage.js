var DATADIR = __dirname + '/data/'
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs-extra'))

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
  return Promise.all(words.map( function(word) {
    console.log(word)
    console.log(word.word)
      var dir = DATADIR + category
      var file  = '/' + word.word + '.json'

      fs.ensureDir(dir, function(err) {
        console.log(err)
      })

    return  fs.openAsync(dir + file, 'w+').then(function(fd) {
        fs.write( fd, JSON.stringify(word), null, 'utf8', function() {
        fs.close(fd, function() {
          console.log('file closed');
        });
      })
  })
  })
)}
}
