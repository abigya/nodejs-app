var LocalStrategy = require("passport-local").Strategy;
var mysql = require('mysql');
var Cryptr = require('cryptr');
cryptr = new Cryptr('myTotalySecretKey');
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'Abigy@15',
  database : 'smartfridge'


});

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.userID);
 });

 passport.deserializeUser(function(userID, done){
  connection.query("SELECT * FROM user WHERE userID = ? ", [userID],
   function(err, rows){
    done(err, rows[0]);
   });
 });

 passport.use(
  'local-signup',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM user WHERE username = ? ", 
   [username], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'The username is already taken'));
    }else{
     var newUserMysql = {
      username: username,
      password: cryptr.encrypt(password)
     };

     var insertQuery = "INSERT INTO user (username, password) values (?, ?)";

     connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
      function(err, rows){
        newUserMysql.userID = rows.insertId;
       return done(null, newUserMysql);
      });
    }
   });
  })
 );

 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM user WHERE username = ? ", [username],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage', 'No User Found'));
    }

    decryptedString = cryptr.decrypt(rows[0].password);
    if(password!=decryptedString)
     return done(null, false, req.flash('loginMessage', 'Wrong Password'));

    return done(null, rows[0]);
   });
  })
 );

 


};