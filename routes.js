// routes.js
var CASType = require('./models/cas-validation-response');
var emailer = require('./modules/emailer');
var createAccount = require('./modules/create-account');
var authentication = require('./modules/login-authentication');
const express = require('express')
//const expresslayouts = require('express-ejs-layouts');
const router = express.Router()
const layout = require('express-layout')
var fs = require('fs');
var CASAuthentication = require('cas-authentication');
var request = require('request');
var CASURL = "https://signin.k-state.edu/WebISO/";

var bodyParser = require('body-parser'); 
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
var crypto = require('crypto');

var createVideo = require('./modules/CreateVideo');
var homepage = require('./modules/homePageVideo');


const uploaderMiddlewares = require('./middlewares/uploader');



/***** THE DATABASE ß */

var mysql = require('mysql')
var fs = require('fs');
let rawdata = fs.readFileSync(__dirname+'/../credentials.json','utf8');  
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












var CASAuthentication = require('cas-authentication');
 
var cas = new CASAuthentication({
  cas_url     : CASURL,
  service_url : 'https://sriegodedios.com/validate',
  cas_version     : '2.0',
  session_name    : 'cas_user',
  session_info    : 'ValidateTicket',

});

router.get( '/app', cas.bounce, function ( req, res, next ) {
   
  res.send( '<html><body>Hello!</body></html>' );
});




/*******************
 *  Route for the main page
 * *****************/
router.get('/', (req, res) => {
  
    res.render('pages/index',{title:'Shane Riegodedios'});

});

router.get('/login', (req,res) => {
  fs.readFile('templates/login.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

/*******************
 *  Route for the serving fieles
 * *****************/
router.get('/core/:type/:file',(req,res) => {

  var type = req.params.type;
  var filename = req.params.file;

  var path = 'core/'+type+'/'+filename

  var content = '';
  switch(type)
  {
    case 'css':
      content = 'text/css';
    break;
    case 'js':
      content = 'text/javascript';
    break;
    case 'pdf':
      content = 'application/pdf'
    break;

  }

  console.log(content)

  fs.readFile(path, function(err, data) {
    res.writeHead(200, {'Content-Type': content});
    res.write(data);
    res.end();
  });
});



/*******************
 *  Route for account activation page
 * *****************/
router.get('/register/activated', (req,res) => {
  res.render('pages/activated', {title: 'Account Activated'})
});

router.get('/function/activation/:activationLink', (req,res) => {
  var link = req.params.activationLink;
  createAccount.Activate(res, link);
  //res.send("Account Activated");
  
})

/*******************
 *  Route for getting videos
 * *****************/
router.route('/function/getVideos')
.get((req, res) => {
   homepage.ConstructHomePage(req,res)
})

/*******************
 *  Route for posting videos
 ******************/
router.post('/function/uploadVideo', uploaderMiddlewares.multer.single('video'), uploaderMiddlewares.sendUploadToGCS, (req, res, next) =>{
    //console.log(req.file)
    //console.log(req.video)
     if (req.file && req.file.cloudStoragePublicUrl) {
      var imageUrl = req.file.cloudStoragePublicUrl;
      createVideo.NewVideo(req,res,imageUrl)
      return res.status(200).send('Upload Completed')
    }
        
     return res.status(500).send('Unable to upload');

});


/****************
 *  Routes for functions
 * 
 ****************/

 /*Email function*/
router.post('/function/email', (req,res) => {
  console.log(req.body)
  var name = req.body.Name;
  var email = req.body.Email; 
  var subject = req.body.Subject;
  var messege = req.body.Messege;

  var e = new emailer();
  e.sendEmail(name,email,subject,messege)
});
/*Register Function*/
router.post('/function/register', (req,res) => {
  var FName = req.body.FirstName;
  var LName = req.body.LastName;
  var DateOfBirth = req.body.Birthday;
  var Email = req.body.Email;
  var Username = req.body.Username;
  var Password = req.body.Password;
  var Gender = req.body.Gender;

 

  createAccount.Insert(FName,LName,DateOfBirth,Gender,Email,Username,Password);

  
  createAccount.SendActivationLink(Username, FName, LName, Email);

  res.redirect('/register/checkEmail/?FName='+FName+'&LName='+LName+'&Email='+Email);
});
/* Authenticate Function */
router.post('/function/authenticate', (req,res) => {
  var username = req.body.username;
  var password = req.body.password;
  console.log("authenticating start")
  if(username && password)
  {
    var encryptedPassword = crypto.createHash('sha256').update(password).digest('base64');
   
    authentication.Authenticate(req, res, username, encryptedPassword);
  }else{
    res.redirect('/login/?failure=1');
  }
});

/****
* Register route
****/
router.route('/register')
    .get((req,res) => {
      res.render('pages/register',{title:'Register'});
    }).post((req, res) => {
      console.log(req.body);
    });
router.route('/register/checkEmail')
    .get((req,res) =>{
      if (Object.keys(req.query).length === 0) 
      {
        res.send("Access Denied");
      }else{
        
        var FName = req.query.FName;
        var LName = req.query.LName;
        var Email = req.query.Email;

        res.render('pages/thankyou',{title:'Registration Complete!', FirstName: FName, LastName: LName, Email:Email});

      }
  });

  router.route('/validate/:location')
    .get((req,res) => {
        var ticket = req.query.ticket
        var location = req.params.location
        
        request(CASURL+'serviceValidate?service=http://sriegodedios.com/validate/app/&ticket='+ticket+'&format=JSON', function (error, response, body) {
          
           
           console.log(body);
            const validationResponse = new CASType.CASValidationResponse(JSON.parse(body));
            if (!validationResponse.validated) {
              return res.unauthorized();
            }
            res.send(validationResponse.serviceResponse.authenticationSuccess.attributes.ksuPersonWildcatId)


        })
    });

router.route('/login')
    .get((req, res) => {
      fs.readFile('templates/login.html', function(err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
      });
    })
    .post((req, res) => {
      console.log(req.body)
        var username = req.body.username;
        var password = req.body.password;


        if(username && password)
        {
          //if there is a username and password




        }else{
          
          res.redirect('/login/failure=1');

        }



            
            if(password != 'hi')
            {
              res.send('Access Denied')
            }else{
              res.send('This is the go')
            }
  
      
       
    });


    router.route('/video/:id')
      .get((req, res) =>{
        homepage.FetchVideo(req,res,req.params.id)
      });

    router.route('/home')
      .get((req, res) => {
        if (req.session.loggedin) {
  
          homepage.RenderVideosHomePage(req,res);
          //res.render('pages/home',{title: 'Home'})
          
        } else {
         res.redirect('/login')
        }
        res.end();
      });


    
    router.route('/upload')
      .get((req, res) => {
        if (req.session.loggedin) {
          //res.send('Welcome back, ' + req.session.username + '!');
          var userID = req.session.user_id;
          console.log(userID);
          res.render('pages/upload',{title: 'Upload', UserID: userID})
          
          
        } else {
         res.redirect('/login')
        }
        res.end();
      });


    

    function AuthRedirect(req, res, path)
    {
      if (req.session.loggedin) {
        //res.send('Welcome back, ' + req.session.username + '!');
        res.render('pages/home',{title: 'Home'})
        
        
      } else {
        res.redirect('/login')
      }
      
      res.end();
    
    }


  
    

module.exports = router