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
    
    get_info(parm, function(result){
      var t = result;
      console.log("CHECK")
      res.render('pages/home',{title: 'Home', videos: t});

      //rest of your code goes in here
   });



}


function get_info(data, callback){

  var sql = "SELECT a from b where info = data";

  var sql ="SELECT V.VideoId, V.UserId, A.Username, V.Title, CloudLink FROM `Videos` V INNER JOIN `Accounts` A ON V.UserId=A.ID"
  con.query(sql, function (err, result) {
      if (err) throw err;
      
        
        

  });
}


module.exports.ConstructHomePage = ConstructHomePage;