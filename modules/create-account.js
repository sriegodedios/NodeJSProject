var mysql = require('mysql')
var fs = require('fs');
let rawdata = fs.readFileSync(__dirname+'/../../credentials.json','utf8');  
let credentials = JSON.parse(rawdata)
//console.log(credentials["credentials"]["email"]["account"]);
var user = credentials["credentials"]["mysql"]["account"];
var dbPassword = credentials["credentials"]["mysql"]["password"];
var dbhost = credentials["credentials"]["mysql"]["host"];
var con = mysql.createConnection({
    host: dbhost,
    user: user,
    password: dbPassword,
    database: "Application"
  });

  class CreateAccount {
    static Insert(FName, LName, Birthday, Email, Username, Password) {
        if (err) throw err;
        console.log("Connected!");
     
        var sql = "INSERT INTO `Accounts` (FirstName, LastName, Username, Password) VALUES ('"+FName+"', '"+LName+"', '"+Birthday+"', '"+Username+"', '"+encryptPassword+"')";
        
        con.query(sql, function (err, result) {
          if (err) throw err;

          console.log("1 record inserted");
      
        });

        
    }
  }

  module.exports = CreateAccount