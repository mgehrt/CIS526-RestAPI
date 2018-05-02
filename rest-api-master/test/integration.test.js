const fs = require('fs');
const request = require('request');
const server = require('../src/server');

const PORT = 3000;
const HOST = 'http://localhost:' + PORT;
const DATA_FILE = './test.db.json';
const DATA = {
  courses: {
    "one":{name: "one"},
    "two":{name: "two"},
    "three":{name: "three"}
  }
};

// Object.values polyfill
if(!Object.values) {
  Object.values = function(obj) {
    var values = [];
    for(var key in obj) {
      values.push(obj[key]);
    }
    return values;
  }
}

beforeEach(function(){
  return new Promise(function(fulfil) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(DATA));
    server.start(PORT, DATA_FILE, fulfil);
  });
});

afterEach(function() {
  return new Promise(function(fulfil) {
    server.stop();
    fs.unlink(DATA_FILE, fulfil);
  });
});

// TEST CRUD methods:

// TEST Create functions
test('POST /courses should create a new class in DB', function(done){
  const createdEntry = {name: "four 4"};
  request({
    url: HOST + '/courses',
    method: 'POST',
    json: createdEntry
  }, function(error, response, body) {
    expect(error).toBeNull();
    fs.readFile(DATA_FILE, {encoding: "utf-8"}, function(err, data) {
      expect(err).toBeNull();
      // clone the DATA constant
      var newDATA = JSON.parse(JSON.stringify(DATA));
      // Add the new class
      newDATA["courses"]["four4"] = createdEntry;
      expect(data).toEqual(JSON.stringify(newDATA));
      done();
    });
  });
});

// TEST Read functions (list, read)
test('GET /courses should return courses in DB', function(done){
  request(HOST + '/courses', function(error, response, body){
    expect(error).toBeNull();
    expect(body).toEqual(JSON.stringify(Object.values(DATA["courses"])));
    done();
  });
});

test('GET /courses/:id should return specified class', function(done){
  request(HOST + '/courses/one', function(error, response, body){
    expect(error).toBeNull();
    expect(body).toEqual(JSON.stringify(DATA["courses"]["one"]));
    done();
  });
});

// TEST Update functions
test('PUT /courses/:id should update specified class', function(done){
  const editedEntry = {name: "Too Far"};
  request({
    url: HOST + '/courses/two',
    method: 'PUT',
    json: editedEntry
  }, function(error, response, body){
    expect(error).toBeNull();
    fs.readFile(DATA_FILE, {encoding: "utf-8"}, function(err, data) {
      expect(err).toBeNull();
      // clone the DATA constant
      var newDATA = JSON.parse(JSON.stringify(DATA));
      // Add the new class
      newDATA["courses"]["two"] = editedEntry;
      expect(data).toEqual(JSON.stringify(newDATA));
      done();
    });
  });
});

// TEST destroy function
test('DELETE /courses/:id should destroy specified class', function(done){
  request({
    url: HOST + '/courses/three',
    method: 'DELETE'
  }, function(error, response, body){
    expect(error).toBeNull();
    fs.readFile(DATA_FILE, {encoding: "utf-8"}, function(err, data) {
      expect(err).toBeNull();
      // clone the DATA constant
      var newDATA = JSON.parse(JSON.stringify(DATA));
      // Remove the deleted class
      delete newDATA["courses"]["three"];
      expect(data).toEqual(JSON.stringify(newDATA));
      done();
    });
  });
});
