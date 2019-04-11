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


function ConstructHomePage(req, res)
{
  //console.log("IN THE RENDER")

    var sql ="SELECT V.VideoId, V.UserId, A.Username, V.Title, CloudLink FROM `Videos` V INNER JOIN `Accounts` A ON V.UserId=A.ID"
    con.query(sql, function (err, result) {
        if (err)
        {
          throw err;
        }else{
          console.log("IN THE RENDER")
          console.log(result)
          res.render('pages/home',{title: 'Home', videos: result});
        }
          

    });



}

module.exports.ConstructHomePage = ConstructHomePage;