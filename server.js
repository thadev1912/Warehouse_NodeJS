const express = require('express');
const app = express();
const port = 8080;
require('dotenv').config()
const route = require('./src/routes/index');
//const handlebars = require('express-handlebars');
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
app.use(express.static(path.join(__dirname, 'public'))); // cần check lại link css  
//midleware

app.use(express.json())  // hỗ trợ json
app.use(bodyParser.urlencoded({ extended: true }));  // dùng để res.body

route(app);
connectDB();

// helper();
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
// app.use(function (req, res, next)
// {
//     res.locals.toasts = req.toastr.render()
//     next()
// });
//middleware cho trường hợp sai đường dẫn 
app.all('*', (req, res) => {
  res.status(404);  
  if (req.accepts('json')) {
      res.json({ "error": " Page 404 Not Found" });
  } else {
      res.type('txt').send(" Page 404 Not Found");
  }
});
// //Templete Engine
// app.engine('hbs', handlebars.engine({
//   extname: '.hbs',
//   //code để render re view handlebars
//   runtimeOptions: {
//     allowProtoPropertiesByDefault: true,
//     allowProtoMethodsByDefault: true
//   },
// },
// ));
// app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'src/resources/views'));// check đường dẫn để điều hướng sang thu mục view
