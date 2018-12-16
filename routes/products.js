/*
 * GET products listing.
 */
var mysql = require('mysql');
var connection = mysql.createConnection({
     host     : '127.0.0.1',
     user     : 'root',
     password : 'Abigy@15',
     database : 'smartfridge',
     port: 3306
 });
 
 // connect to mysql
 connection.connect(function(err) {
     if (err) {
       return console.error('error');
     }
    
     console.log('Connected to the MySQL server.');
   });
exports.list = function(req, res){

       connection.query('SELECT * FROM products',function(err,rows)     {
              
          if(err)
             console.log("Error Selecting : %s ",err );
       
              res.render('products',{page_title:"Products - Node.js",data:rows});
                             
           });
         
      
    
  };
  exports.add = function(req, res){
    res.render('add_product',{page_title:"Add Products-Node.js"});
  };
  exports.edit = function(req, res){
      
    var productID = req.params.productID;
      
         
       connection.query('SELECT * FROM products WHERE productID = ?',[productID],function(err,rows)
          {
              
              if(err)
                  console.log("Error Selecting : %s ",err );
       
              res.render('edit_product',{page_title:"Edit Products - Node.js",data:rows});
                             
           });
                   
  };
 
  exports.save = function(req,res){
      
      var input = JSON.parse(JSON.stringify(req.body));
          
          var data = {
              
              name    : input.name,
              category : input.category,
              quantity: input.quantity,
              expiration: input.expiration,
              calories: input.calories,
              serving: input.serving
          
          };
          
          var query = connection.query("INSERT INTO products set ? ",data, function(err, rows)
          {
    
            if (err)
                console.log("Error inserting : %s ",err );
           
            res.redirect('/products');
            
          });
          
  };
  
  //save edited product
  exports.save_edit = function(req,res){
      
      var input = JSON.parse(JSON.stringify(req.body));
      var productID = req.params.productID;
    
          
          var data = {
              
            name    : input.name,
            category : input.category,
            quantity: input.quantity,
            expiration: input.expiration,
            calories: input.calories,
            serving: input.serving
          
          };
          
          connection.query("UPDATE products set ? WHERE productID = ? ",[data,productID], function(err, rows)
          {
    
            if (err)
                console.log("Error Updating : %s ",err );
           
            res.redirect('/products');
            
          });
      
    
  };
  
  exports.remove = function(req,res){
            
       var productID = req.params.productID;
      
          connection.query("DELETE FROM products  WHERE productID = ? ",[productID], function(err, rows)
          {
              
               if(err)
                   console.log("Error deleting : %s ",err );
              
               res.redirect('/products');
               
          });

          connection.query("ALTER TABLE `products` DROP `productID`");
          connection.query("ALTER TABLE `products`ADD `productID` INT NOT NULL AUTO_INCREMENT FIRST, ADD PRIMARY KEY(`productID`)");
          
  };

 