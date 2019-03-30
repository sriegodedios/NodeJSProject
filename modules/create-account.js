var mysql = require('mysql')
var fs = require('fs');
let rawdata = fs.readFileSync(__dirname+'/../../credentials.json','utf8');  
let credentials = JSON.parse(rawdata)
//console.log(credentials["credentials"]["email"]["account"]);
var user = credentials["credentials"]["mysql"]["account"];
var dbPassword = credentials["credentials"]["mysql"]["password"];
var dbhost = credentials["credentials"]["mysql"]["host"];
var con = mysql.createConnection({
    multipleStatements: true,
    host: dbhost,
    user: user,
    password: dbPassword,
    database: "sriegode_Application"
  });
var crypto = require('crypto');

function MakeString()
    {
      var now = Date.now();

      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < possible.length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

      return (text+now);

      
    }



  class CreateAccount {
    static Insert(FName, LName, Birthday, Gender, Email, Username, Password) {
       con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var encryptedPassword = crypto.createHash('sha256').update(Password).digest('base64');
            // Comes in as MM/DD/YYYY -> Convert tp YYYY-MM-DD
            var temp = Birthday.split("/")
            console.log(temp[3]);
            var newBDay = temp[2]+"-"+temp[0]+"-"+temp[1];
            console.log(newBDay);


            


            

            var uniqueString = MakeString()

            var sql = "INSERT INTO `Accounts` (FirstName, LastName, Birthday, Gender, Email, Username, Password) VALUES ('"+FName+"', '"+LName+"', '"+newBDay+"', '"+Gender+"', '"+Email+"','"+Username+"', '"+encryptedPassword+"');";
             
              
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 records inserted");
                //var sql1 = "SELECT ID FROM `Accounts` WHERE Username='"+Username+"'";
                //con.query(sql, function (err, result) {
                //  if (err) throw err;
                 // var sql1 = "SELECT ID FROM `Accounts` WHERE Username=' "+Username+ "'";
                  var sql2= "INSERT INTO `Activation` (ID, ActivationLink) VALUES ((SELECT ID FROM `Accounts` WHERE Username='"+Username+"'), '"+uniqueString+"')"
                  con.query(sql2, function (err, result) {
                    if (err) throw err;
                    console.log("1 record inserted");
                    return true;
                });          
                });                
            });

            return false;
       
    }

    

    

    
  }

  module.exports = CreateAccount