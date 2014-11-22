'use strict';

/**
 * Module dependencies.
 */
//var log                      = require('winston-wrapper')(module);
var config                   = require('nconf');

var requireTree              = require('require-tree');
var controllers              = requireTree('../controllers');
var mustAuthenticatedMw      = require('../middlewares/must-authenticated');  

// End of dependencies.


module.exports = function() {
  
  // Only for registred users
  this.all('/private',       mustAuthenticatedMw);
  this.all('/private/*',     mustAuthenticatedMw);


  // Basic routes
  this.get('/',              controllers.render('public'));
  this.get('/private',       controllers.render('private'));
  this.get('/fail',          controllers.render('fail'));


  // Auth controllers
  this.post('/login',        controllers.users.login);
  this.post('/register',     controllers.users.register);
  this.get('/logout',        controllers.users.logout);

  //Private room call
  this.get('/private/room', function (req, res) {
    res.render('webrtc/room', {
      user: req.user, 
      peer:{ 
        host: '192.168.1.37',
      }
    });
  });


};