var DATADIR = __dirname + '/data/'
var fs = require('fs')

var data = ['{}']

var getAllWordsOfCategory = function(category, onContent, onError) {
  var directory = DATADIR+category

  fs.readdir(directory, function(err, files) {
    if (err) {
      onError(err)
      return;
    }
      files.forEach(function(file) {
      console.log('Files: ' + file);

      readFile(directory+'/'+file, onContent, onError)
    });

  })
}


var readFile = function(path, onContent, onError) {
  fs.readFile(path, 'utf-8' , function(err, content) {
    if(err) {
      onError(err)
      return;
    }

    onContent(content);
  })
}

var onFileContent = function(content) {
  data.push(content)
}

var onError = function(err) {
  console.log(JSON.stringify(err))
}


getAllWordsOfCategory('', onFileContent, onError)
