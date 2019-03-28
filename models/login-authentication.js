var mysql = require('mysql')

let rawdata = fs.readFileSync('../../credentials.json');  
let credentials = JSON.parse(rawdata);
console.log(credentials) 