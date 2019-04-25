var mysql = require('mysql')
var fs = require('fs');
let rawdata = fs.readFileSync(__dirname+'/../../credentials.json','utf8');  
let credentials = JSON.parse(rawdata)
//console.log(credentials["credentials"]["email"]["account"]);
var user = credentials["credentials"]["mysql"]["account"];
var dbPassword = credentials["credentials"]["mysql"]["password"];
var dbhost = credentials["credentials"]["mysql"]["host"];
var crypto = require('crypto');

var con = new mysql.createConnection({
  multipleStatements: true,
  host: dbhost,
  user: user,
  password: dbPassword,
  database: "sriegode_Application"
});

function Authenticate(req, res, Username, Password)
{
  console.log("In the authentication method!")
  //con.connect(function(err) {
   // if (err) throw err;
   // console.log("Connected!");

    
    console.log("Username: "+Username)
    console.log("Password: "+Password)
    con.query('SELECT * FROM `Accounts` WHERE Username = ? AND Password = ?', [Username, Password],function (err, result) {
      if (err) throw err;
      
      console.log(result)
      if (result.length > 0) {
        
        if(result[0].Status = 'Activated')
        {

          //Login User and their account is activated
          req.session.loggedin = true;
          req.session.username = Username;
          req.session.firstname = result[0].FirstName;
          req.session.lastname =  result[0].LastName;
          console.log("ID: "+result[0].ID);
          req.session.user_id = result[0].ID
            
          
          res.redirect('/home');
         



        }else{
          //account is not activated
          res.redirect('/login/?failure=3');
        }
        
       
          


      }else{
        //Login Failed
        
        res.redirect('/login/?failure=2');
        

      }



    });
  //});



}

module.exports.Authenticate = Authenticate;
  