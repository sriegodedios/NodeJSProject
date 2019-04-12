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


function NewVideo(req,res,videoLink)
{
    var sql = "INSERT INTO `Videos` (UserId, Title, CloudLink, Description) VALUES (?,?,?,?)";
    con.query(sql, [req.session.user_id, req.body.Title, videoLink, req.body.Description],function (err, result) {
         if (err) throw err;

         res.render('pages/home',{title: 'Home'})
      //console.log(result)
      
    });
    
}

module.exports.NewVideo = NewVideo; 