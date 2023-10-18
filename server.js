const express = require('express');
const app = express();
const http = require("http");
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
const server = http.createServer(app);
const socketIo = require("socket.io")(server, {
  cors: {
    origin: "*",
  }
});
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
app.listen(port, ipAddress, () => {
  console.log(`Server running on http://${ipAddress}:${port}`)
})
server.listen(5000, ipAddress, () => {
  console.log('Chat System already open on port 5000');
});
//***********Socket IO*******************//
socketIo.on("connection", (socket) => {
  console.log("User " + socket.id + " connected into room");

  socket.emit("getId", socket.id);

  socket.on("sendDataClient", function (data) {
    console.log(data)
    socketIo.emit("sendDataServer", { data });
  })

  socket.on("disconnect", () => {
    console.log("User " + socket.id + " leave room");
  });
});
//Test máy chủ chat SocetIO
app.get("/", (req, res) => {
  res.status(200).send({
    success: true,
    message: "Wellcome Chat System ",
  });
});
//middleware cho trường hợp sai đường dẫn 
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('json')) {
    res.json({ "error": "Incorrect in your url API! Please check again " });
  } else {
    res.type('txt').send(" Page 404 Not Found");
  }
});

