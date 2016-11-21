var DATADIR = __dirname + '/data/'
var Promise = require('bluebird')
var fs = Promise.promisifyAll(require('fs'))

var data = ['{}']

var getAllWordsOfCategory = function(category) {
  var directory = DATADIR+category
  var promises = [];
var i = 0;
  promises = fs.readdirAsync(directory).map(function(filename) {
    return readFile(directory + '/' + filename)
  })

  return Promise.all(promises)
}


var readFile = function(path) {
  return fs.readFileAsync(path, 'utf-8')
}

var onFileContent = function(content) {
  data.push(content)
}

var onError = function(err) {
  console.log(JSON.stringify(err))
}


getAllWordsOfCategory('').then(function(filesContent) {
  filesContent.forEach(function(content){
    console.log(content);
  },
  function(err) {
    console.log(err);
  })
})
