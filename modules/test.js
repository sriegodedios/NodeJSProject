var mysql = require('mysql')
var fs = require('fs');
let rawdata = fs.readFileSync(__dirname+'/../credentials.json','utf8');  
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

  //var sql = "SELECT ActivationLink FROM `Activation` WHERE ID=(SELECT ID FROM `Accounts` WHERE Username='"+username+"')"
  var id = username
  const result = await con.query('SELECT ActivationLink FROM `Activation` WHERE ID =  (SELECT ID FROM `Accounts` WHERE Username = ? );', [id]); 
  if (!result[0].length < 1) {
    throw new Error('Post with this id was not found');
  }
  console.log(result[0])


