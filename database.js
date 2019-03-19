
module.exports = {
    Init: function () {
      Initialize();
    },
  };


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('data');
 


function Initialize(){
    db.serialize(function() {
        var st = "CREATE TABLE IF NOT EXISTS Accounts("
               + "AccountID INTEGER PRIMARY KEY,"
               + "FirstName text NOT NULL,"
               + "LastName text NOT NULL,"
               + "Email text NOT NULL,"
               + "Password text NOT NULL)";
            
      db.run(st);
          
    })
    db.close();

    function InsertPeople(){
        var st = "CREATE TABLE IF NOT EXISTS Accounts("
        + "AccountID INTEGER PRIMARY KEY,"
        + "FirstName text NOT NULL,"
        + "LastName text NOT NULL,"
        + "Email text NOT NULL,"
        + "Password text NOT NULL)";
    }
}
