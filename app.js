var express = require('express');
var bodyParser = require('body-parser');
var apiVersion = require('./package').version;
var fs = require('fs');
var path = require('path');
var app = express();

app.set('port', 5001);

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
      return res.status(404)
              .json({
                'result': 'Data was not found'
              }).end();
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
      return res.status(404)
              .json({
                'result': 'Data was not found'
              }).end();
    }

    fs.readdir(absPath, function(err, data) {
      if(err) {
        return res.status(404)
                .json({
                  'result': 'Error durring preparing response'
                }).end();
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

app.post('/data/' + apiVersion + '/:id', function(req, res) {
  console.log(req.method, req.path);

  var name = req.path.replace('/' + apiVersion + '/', '/').concat('.json');
  var absPath = path.join(__dirname, name);

  fs.stat(absPath, function(err) {
    res.setHeader('content-type', 'application/json');

    if(err) {
      fs.writeFile(absPath, JSON.stringify(req.body), function(err) {
        if(err) {
          return res.status(500).json({
                "err": err
                  }).end();
        } else {
          return res.status(200)
                    .json({'status': 'success'})
                    .end();
        }
      });
    } else {
      return res.status(409)
              .json({
                'status': 'not applied'
              }).end();
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
      return res.status(404).json({
        "status": "not applied",
        "err": err
      }).end();
    }

    fs.writeFile(absPath, JSON.stringify(req.body), {'flag':'w'}, function(err) {
      if(err) {
        return res.status(500).json({
              "err": err
            }).end();
      } else {
        return res.status(200)
                  .json({'status': 'success'})
                  .end();
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
      return res.status(404).json({
        "status": "not applied",
        "err": err
      }).end();
    } else {
      return res.status(200).json({
        "status": "success"
      }).end();
    }
  });
});
