// server.js
const path = require('path')
const express = require('express')
const layout = require('express-layout')
const routes = require('./routes')
const app = express()





// Require static assets from public folder
//pp.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
//app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

var session = require('express-session');

app.use( session({
  secret            : 'super secret key',
  resave            : false,
  saveUninitialized : true
}));

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

const middleware = [
  layout(),
  express.static(path.join(__dirname, 'public')),
]
app.use(middleware)

app.use('/', routes)


app.use((req, res, next) => {
  res.status(404).send("Sorry can't find that!")
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke! This will be reported!')
})



app.listen(3000, () => {
  console.log(`App running at http://localhost:3000`)
})

