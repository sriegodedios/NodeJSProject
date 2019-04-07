var mysql = require('mysql')
var fs = require('fs');
let rawdata = fs.readFileSync(__dirname+'/../../credentials.json','utf8');  
let credentials = JSON.parse(rawdata)
//console.log(credentials["credentials"]["email"]["account"]);
var user = credentials["credentials"]["mysql"]["account"];
var dbPassword = credentials["credentials"]["mysql"]["password"];
var dbhost = credentials["credentials"]["mysql"]["host"];
var con = new mysql.createConnection({
  multipleStatements: true,
  host: dbhost,
  user: user,
  password: dbPassword,
  database: "sriegode_Application"
});
var crypto = require('crypto');

var emailer = require('./emailer');

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
      // con.connect(function(err) {
       //     if (err) throw err;
       //     console.log("Connected!");
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
                     
                }); 
                
                
              var sql2= "INSERT INTO `Activation` (ID, ActivationLink) VALUES ((SELECT ID FROM `Accounts` WHERE Username='"+Username+"'), '"+uniqueString+"')"
              con.query(sql2, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                return true;
          });       
                
                

     //       });

           

            return false;
       
    }
    static Activate(res, link)
    {
     
     // con.connect(function(err) {
     //   if (err) throw err;
     //   console.log("Connected!");


      var updateSQL = "UPDATE `Accounts` A INNER JOIN `Activation` AC ON A.ID=AC.ID SET A.Status='Activated' WHERE AC.ActivationLink = ?"

      con.query(updateSQL,[link],function(err, result){
          if(err) throw err;

          console.log("Activated User");

          console.log(result.changedRows);
         
          if (result.affectedRows > 0) {
            //If the row changed

             var sqlDelete ="DELETE FROM `Activation` WHERE ActivationLink = ?";
             con.query(sqlDelete,[link], function (err, result) {
                if (err) throw err;
                console.log("Removed activation link;")

                res.redirect('/register/activated');



            });
          }else{
            console.log("The activation link is no longer valid");

            res.send("This link no longer is valid")



          }

       }); 
       /* var sql = "SELECT ID FROM `Activation` WHERE ActivationLink='"+link+"'";
        con.query(sql,function (err, result) {
          var temp;
          if (err) throw err;
          console.log(result)
          temp = result[0].ID;
          var sql2 = "UPDATE `Accounts` SET Status='Activated' WHERE ID='"+temp+"'";
          con.query(sql2,function (err, result) {
          if (err) throw err;
          console.log("Account Activated")
          var sql3 ="DELETE FROM `Activation` WHERE ActivationLink = '"+link+"'";
          con.query(sql3,function (err, result) {
            if (err) throw err;
            console.log("Removed activation link;")

          });
          
        });

    //    });

        

      });*/

    }

    static SendActivationLink(Username, FName, LName, Email)
    {
      var temp;
      setTimeout(function(){
        console.log("DOG");
    
        
           con.query("SELECT ActivationLink FROM Activation ACT INNER JOIN Accounts ACC ON ACT.ID=ACC.ID WHERE ACC.Username='"+Username+"'", function (err, result, fields) {
          // if any error while executing above query, throw error
              if (err) throw err;
          // if there is no error, you have the result
            //console.log(result);
            
              temp = result[0].ActivationLink;

              var e1 = new emailer();

      

              var Message ="Hi, "+FName+" "+LName+",<br/>"
                  +"You have successfully registered! To activate your account,<br/>"
                  +"please use this link to activate your account!<br/>"
                  +"<a href='https://sriegodedios.com/function/activation/"+temp+"'>Click Here To Activate!</a><br/><br/>"
                  +"Do not reply to this message.";



              e1.sendEmailR(Email, Message)



            
             
        });  
        
        }, 200);
        
    
 
    }

    

    

    
  }


  module.exports = CreateAccount