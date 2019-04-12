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

var temp = [];
function ConstructHomePage(req, res)
{
  console.log("IN THE RENDER")

   var sql ="SELECT V.VideoId, V.UserId, A.Username, V.Title, CloudLink FROM `Videos` V INNER JOIN `Accounts` A ON V.UserId=A.ID"
   con.query(sql, function (err, result) {
                if (err) throw err;
                // console.log("IN THE RENDER")
                //req.session.homepage = result
                // res.render('pages/home',{title: 'Home', videos: result});
                console.log(result)
                //return result;
                setValue(result)


              });
    

    var s ="";
    for(var i = 0; i < temp.length; i ++)
    {
      s +=  '<div class="col-md-3">'
      s +=  '<a href="/test" class="card" display: inline-block">'
      s +=  '<video class="card-img-top" width="320" height="240" no-controls>'
      s +=     '<source src="https://storage.googleapis.com/sriegodedios/15549352199530B4FB553-69F1-4EE0-ACC9-E5E0F4126B23.MOV" type="video/mp4">'
      s +=    '</video>'
      s +=    '<div class="card-body">'
      s +=       ' <h5> This is a test of the video</h5>'
      s +=    '   Check'
      s +=   ' </div>'
      s +=      ' </a>'
      s += ' </div>'

    }          
    console.log(s)
    res.send(s);
    res.end();
    //

    //res.render('pages/home',{title: 'Home', data: temp});

  /* var temp = [];
    var query = con.query('SELECT V.VideoId, V.UserId, A.Username, V.Title, CloudLink FROM `Videos` V INNER JOIN `Accounts` A ON V.UserId=A.ID');
    query
      .on('error', function(err) {
        // Handle error, an 'end' event will be emitted after this as well
        throw err
      })
      .on('fields', function(fields) {
        // the field packets for the rows to follow
      })
      .on('result', function(row) {
        // Pausing the connnection is useful if your processing involves I/O
        //con.pause();
        temp.push(row)
       // processRow(row, function() {
       //   con.resume();
       // });
      })
      .on('end', function(result, next) {
        // all rows have been received
        console.log(result)
      });*/

      


}

function setValue(value) {
  temp= JSON.stringify(value);
  console.log(temp);
}

module.exports.ConstructHomePage = ConstructHomePage;