// Any files in this directory will be `require()`'ed when the application
// starts, and the exported function will be invoked with a `this` context of
// the application itself.  Initializers are used to connect to databases and
// message queues, and configure sub-systems such as authentication.

// Async initializers are declared by exporting `function(done) { /*...*/ }`.
// `done` is a callback which must be invoked when the initializer is
// finished.  Initializers are invoked sequentially, ensuring that the
// previous one has completed before the next one executes.


'use strict';

//var log            = require('winston-wrapper')(module);
var config         = require('nconf');

var mongoose       = require('mongoose');
var requireTree    = require('require-tree');
var models         = requireTree('../../models/');


module.exports = function(done) {

  mongoose.connection.on('open', function() {
    console.log('Connected to mongo server!');
    return done();
  });

  mongoose.connection.on('error', function(err) {
    log.error('Could not connect to mongo server!');
    log.error(err.message);
    return done(err);
  });

  try {
    mongoose.connect(config.get('mongoose:db'));
    console.log('Started connection on ' + (config.get('mongoose:db')) + ', waiting for it to open...'.grey);
  } catch (err) {    
    done(err);
  }

};
