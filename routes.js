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


router.get('/', (req, res) => {
  //fs.readFile('templates/index.html', function(err, data) {
   // res.writeHead(200, {'Content-Type': 'text/html'});
   // res.write(data);
    //res.end();
    res.render('pages/index',{title:'Shane Riegodedios'});
 // });
});

router.get('/login', (req,res) => {
  fs.readFile('templates/login.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  });
});

//file server
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

router.get('/function/activation/:activationLink', (req,res) => {
  var link = req.params.activationLink;
  createAccount.Activate(link);
  res.send("Account Activated");




})
router.post('/function/:type', (req,res) => {
  var type = req.params.type;
  switch(type){
    case 'email':
      console.log(req.body)
      var name = req.body.Name;
      var email = req.body.Email; 
      var subject = req.body.Subject;
      var messege = req.body.Messege;

      var e = new emailer();
      e.sendEmail(name,email,subject,messege)
      res.send('Email Sent');
    break;
    case 'register':
      var FName = req.body.FirstName;
      var LName = req.body.LastName;
      var DateOfBirth = req.body.Birthday;
      var Email = req.body.Email;
      var Username = req.body.Username;
      var Password = req.body.Password;
      var Gender = req.body.Gender;

     

      createAccount.Insert(FName,LName,DateOfBirth,Gender,Email,Username,Password)

      
      createAccount.SendActivationLink(Username, FName, LName, Email);

      res.redirect('/register/checkEmail/?FName='+FName+'&LName='+LName+'&Email='+Email);
      //console.log(link);
      //res.send("Registered!")
      break;
      case 'authenticate':
        var username = req.body.username;
        var password = req.body.password;
        console.log("authenticating start")
        if(username && password)
        {
          var encryptedPassword = crypto.createHash('sha256').update(password).digest('base64');
          //console.log("Encrypted Password: "+);
          authentication.Authenticate(req, res, username, encryptedPassword);
        }else{
          res.redirect('/login/?failure=1');
        }

        break;
        default:
          res.send("NOT FOUND");
        break;

        

  }
});



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
      



      
    }) 

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

    router.route('/home')
      .get((req, res) => {
        if (req.session.loggedin) {
          res.send('Welcome back, ' + req.session.username + '!');
        } else {
          res.send('Please login to view this page!');
        }
        res.end();
      });


  
    

module.exports = router