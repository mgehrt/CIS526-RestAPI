const fs = require('fs');

// Module variables
var data = {};
var datafile = "";

/** @function handleRequest
  * This function maps incoming requests to
  * API calls.
  * TODO set up mapping.
  * @param {http.clientRequest} req - the incoming request
  * @param {http.serverResponse} res - the response to serve
  */
function handleRequest(req, res) {
  if(req.method === 'POST' && req.url === '/courses') {
    return createCourse(req, res);
  }
  else if(req.method === 'GET' && req.url === '/courses') {
    return readAll(req, res);
  }
  else if(req.method === 'GET' && req.url.includes('/courses/')) {
    return readOne(req, res);
  }
  else if(req.method === 'PUT' && req.url.includes('/courses/')) {
    return updateCourse(req, res);
  }
  else if(req.method === 'DELETE' && req.url.includes('/courses/')){
    return deleteCourse(req, res);
  }
  else {
    res.statusCode = 400;
    res.end("Not implemented");
  }
}

function createCourse(req, res) {
  var jsonString = "";

  req.on('data', function(chunk) {
    jsonString += chunk;
  });

  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });
  req.on('end', function(){
    try {
      var course = JSON.parse(jsonString);
      var tokens = course.name.split(" ");
      if(tokens.length < 2) {
        res.statusCode = 422;
        res.end("Poorly formatted course entry");
        return;
      }
      var id = tokens[0] + tokens[1];
      data["courses"][id] = course;
      save();
      res.statusCode = 200;
      res.end(id);
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end("Server Error: " + err);
    }
  });

}


function readAll(req, res){
  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });

  req.on('data', function(data) {
    //do nothing
  });

  req.on('end', function(end) {
    res.statusCode = 200;
    var temp = [];
    for(c in data.courses){
      temp.push(data.courses[c]);
    }

    res.end(JSON.stringify(temp));
  });
}

function readOne(req, res) {
  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });

  req.on('data', function() {
    //do nothing
  });

  req.on('end', function(){
    res.statusCode = 200;
    var courseName = req.url.split('/').pop();
    res.end(JSON.stringify(data.courses[courseName]));
  });
}

function updateCourse(req, res) {
  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });

  req.on('data', function(){
    //do nothing
  });

  req.on('end', function(){
    res.statusCode = 200;
    
  });
}

function deleteCourse(req, res) {
  req.on('error', function(err) {
    console.error(err);
    res.statusCode = 500;
    res.end("Server Error");
  });

  req.on('data', function(){
    //do nothing
  });

  req.on('end', function( ) {
    res.statusCode = 200;
    var courseName = req.url.split('/').pop();
    delete data.courses[courseName];
    save();
    res.end();
  });
}

/** @function load
  * Loads the persistent data file
  * @param {string} filename - the file to load
  */
function load(filename) {
  datafile = filename;
  data = JSON.parse(fs.readFileSync(filename, {encoding: "utf-8"}));
}

/** @function save
  * Saves the data to the persistent file
  */
function save() {
  fs.writeFileSync(datafile, JSON.stringify(data));
}

/** @module API
  * A module implementing a REST API
  */
module.exports = {
  load: load,
  handleRequest: handleRequest
}
