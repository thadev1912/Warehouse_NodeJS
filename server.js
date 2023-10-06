const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config()
const route = require('./src/routes/index');
const path = require('path');
const connectDB = require('./config');
const helper = require('./src/helper');
const session = require('express-session')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const toastr = require('express-toastr');
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors()); 
app.use(session({
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));

app.use(flash());
app.use(cookieParser());
// app.use(toastr());
app.use(express.static(path.join(__dirname, 'public'))); 
//midleware

app.use(express.json())  // hỗ trợ json
app.use(bodyParser.urlencoded({ extended: true }));  // dùng để res.body

route(app);
connectDB();
const ipAddress = '192.168.48.31';
// helper();
app.listen(port,ipAddress, () => {
  console.log(`Example app listening at http://${ipAddress}:${port}`)
})

//middleware cho trường hợp sai đường dẫn 
app.all('*', (req, res) => {
  res.status(404);  
  if (req.accepts('json')) {
      res.json({ "error": " Page 404 Not Found" });
  } else {
      res.type('txt').send(" Page 404 Not Found");
  }
});

