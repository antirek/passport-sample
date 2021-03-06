'use strict';

/**
 * Module dependencies.
 */
//var log                      = require('winston-wrapper')(module);
var config                   = require('nconf');

var requireTree              = require('require-tree');
var controllers              = requireTree('../controllers');
var mustAuthenticatedMw      = require('../middlewares/must-authenticated');  
var User                     = require('mongoose').model('user');
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

  this.post('/private/addfriend', function (req, res) {
    console.log(req.body.friend_username);
    User.findOne({username: req.body.friend_username}, function(err, friend){
      console.log(friend._id)
      User.findOneAndUpdate({_id: req.user.id},{$push:{friends : friend._id}}, {safe:true}, function(err, user){
        console.log(user);
        res.send('ok');
      })
    });
    
  });

  //Private room call
  this.get('/private/room', function (req, res) {
    console.log(req.user);
    User.find({_id : {$in : req.user.friends}}, function(err, friends){
      res.render('webrtc/room', {
        user: req.user,
        friends: friends,
        peer:{ 
          host: '192.168.1.37',
        }
      });
    });
  });


};