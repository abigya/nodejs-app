/*
 * GET home page.
 */

var express = require('express');
var router = express.Router();
var connection = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'root',
  password : 'Abigy@15',
  database : 'smartfridge',
  port: 3306
});

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log(req.session); 
});

module.exports = router;