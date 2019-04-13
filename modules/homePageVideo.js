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
                //console.log(result)
                //return result;
                setValue(result)


              });
    

    var s ="";
    console.log(temp.length)

    for(var i = 0; i < temp.length; i ++)
    {
      s +=  '<div class="col-md-3">'
      s +=  '<a href="/video/'+temp[i].VideoId+'" class="card" display: inline-block">'
      s +=  '<video class="card-img-top" width="320" height="240" no-controls>'
      s +=     '<source src="'+temp[i].CloudLink+'" type="video/mp4">'
      s +=    '</video>'
      s +=    '<div class="card-body">'
      s +=       ' <h5> '+temp[i].Title+'</h5>'
      s +=    temp[i].Username
      s +=   ' </div>'
      s +=      ' </a>'
      s += ' </div>'

    }          
    console.log(s)
    res.send(s);
    res.end();
}

var videos = [];
function RenderVideosHomePage(req, res)
{
  var sql ="SELECT V.VideoId, V.UserId, A.Username, V.Title, CloudLink FROM `Videos` V INNER JOIN `Accounts` A ON V.UserId=A.ID"
  con.query(sql, function (err, result) {
                if (err) throw err;
                // console.log("IN THE RENDER")
                //req.session.homepage = result
                // res.render('pages/home',{title: 'Home', videos: result});
                //console.log(result)
                //return result;
                setVideos(result);


  });
    

  var s ="";
  console.log(videos.length)
  res.render('pages/home',{title: 'Home', videos: videos})

}


function FetchVideo(req, res, id)
{
  console.log(id)
  var sql ="SELECT V.VideoId, V.UserId, A.Username, V.Title, V.Description, V.CloudLink FROM `Videos` V INNER JOIN `Accounts` A ON V.UserId=A.ID WHERE V.VideoId = ?"
  con.query(sql,[id],function (err, result) {
    if (err) throw err;
    console.log(result)
    var temp = result[0];
    res.render('pages/video',{title: result[0].Title, video: temp})

  });
}


function setValue(value) {
  temp= value;
  console.log(temp);
}

function setVideos(value){
  videos = value;
  //console.log(temp);
}

module.exports.ConstructHomePage = ConstructHomePage;
module.exports.FetchVideo = FetchVideo;
module.exports.RenderVideosHomePage = RenderVideosHomePage;