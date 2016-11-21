var express = require('express');
var bodyParser = require('body-parser');
var apiVersion = require('./package').version;
var fs = require('fs');
var path = require('path');
var app = express();
var DATADIR = 'data/'

app.set('port', process.env.PORT || 5001);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.listen(app.get('port'), function() {
  console.log('Words mock server is running on port:' + app.get('port'));
});

app.get('/', function(req, res) {
  res.send('<html><body><h1>Words mock server http API! Version ' + apiVersion + '</h1></body></html>');
});

app.get('/data/' + apiVersion + '/:id', function(req, res) {
  console.log(req.method, req.path);

  var name = req.path.replace('/' + apiVersion + '/', '/').concat('.json');
  var absPath = path.join(__dirname, name);

  fs.stat(absPath, function(err) {
    res.setHeader('content-type', 'application/json');
    if(err) {
      return response(res, 404, {'result': 'Data was not found'});
    }
    fs.createReadStream(absPath).pipe(res);
  });
});

app.get('/data/' + apiVersion, function(req, res) {
  console.log(req.method, req.path);

  var name = req.path.replace('/' + apiVersion + '/', '/');
  var absPath = path.join(__dirname, name);

  fs.stat(absPath, function(err) {
    res.setHeader('content-type', 'application/json');

    if(err) {
      return response(res, 404, {'result': 'Data was not found'});
    }

    fs.readdir(absPath, function(err, data) {
      if(err) {
        return response(res, 404, {'result': 'Error durring preparing response'});
      }

      var result = [];
      data.map(function(file) {
        return path.join(absPath, file);
      }).filter(function(file) {
        return !fs.lstatSync(file).isDirectory();
      }).forEach(function(file) {
         try {
           console.log(file);
           var content = fs.readFileSync(file);
           result = result.concat(
             JSON.parse(content, 'utf-8')
           );
         } catch(err) {
           console.log(err);
         }
      });
      res.send(result);
    });
  });

});

app.post('/data/' + apiVersion + '/:category', function(req, res) {
  console.log(req.method, req.path);

  var name = DATADIR + req.params.category + '.json';
  var absPath = path.join(__dirname, name);

  fs.stat(absPath, function(err) {
    res.setHeader('content-type', 'application/json');

    if(err) {
      fs.writeFile(absPath, JSON.stringify(req.body), function(err) {
        if(err) {
          return response(res, 500, {"err": err});
        } else {
          return response(res, 200, {'status': 'success'});
        }
      });
    } else {
      return response(res, 409, {'status': 'not applied'});
    }
  });
});

app.put('/data/' + apiVersion + '/:id', function(req, res) {
  console.log(req.method, req.path);

  var name = req.path.replace('/' + apiVersion + '/', '/').concat('.json');
  var absPath = path.join(__dirname, name);

  fs.stat(absPath, function(err) {
    res.setHeader('content-type', 'application/json');

    if(err) {
      return response(res, 404, {
        "status": "not applied",
        "err": err
      });
    }

    fs.writeFile(absPath, JSON.stringify(req.body), {'flag':'w'}, function(err) {
      if(err) {
        return response(res, 500, {"err": err});
      } else {
        return response(res, 200, {'status': 'success'});
      }
    });
  });
});

app.delete('/data/' + apiVersion + '/:id', function(req, res) {
  console.log(req.method, req.path);

  var name = req.path.replace('/' + apiVersion + '/', '/').concat('.json');
  var absPath = path.join(__dirname, name);

  fs.unlink(absPath, function(err) {
    res.setHeader('content-type', 'application/json');
    if(err) {
      return response(res, 404, {
        "status": "not applied",
        "err": err
      });
    } else {
      return response(res, 200, {'status': 'success'});
    }
  });
});

function response(res, status, json) {
  return res.status(status).json(json);
}
