const express = require('express');
const app = express();
const http = require("http");
const port = 8080;
require('dotenv').config()
const route = require('./src/routes/index');
const path = require('path');
const connectDB = require('./config');
// const helper = require('./src/helper');
const session = require('express-session')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const toastr = require('express-toastr');
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const expressListEndpoints = require('express-list-endpoints');
const AllRoutersName = require('./src/app/models/all_routes_name');
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
//lấy token từ api
//cấp token cho socket..
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
// app.get("/",async (req, res) => {
//   await res.render('index');
// res.status(200).send({
//   success: true,
//   message: "Wellcome Chat System ",
// });
//});
//Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A sample API for learning Swagger',
    },
    servers: [
      {
        url: 'http://192.168.48.31:8080',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.get('/', (req, res) => {
  res.send('Wellcome to NodeJS');
});
//Sử dụng cho 
app.use(express.static('public'));
app.set('view engine', 'ejs');

//get all Router Name
app.get('/api/routes', (req, res) => {
  ischeckStatus = true;
  const allRoutes = expressListEndpoints(app);
  const updatedRoutes = allRoutes.map(route => {
    const secondSlashIndex = route.path.indexOf('/', 1); // Tìm vị trí của '/' thứ hai
    if (secondSlashIndex !== -1) {
      route.path = route.path.slice(secondSlashIndex); // Lấy phần sau ký tự '/'
    }
    return route;
  });
  routes = allRoutes.filter(route => route.path !== "*");
  routes.forEach(async (routeInfo) => {
    routes_code = routeInfo.path;
    const _AllRoutersName = new AllRoutersName({ routes_code: routes_code });
    isComplete = await _AllRoutersName.save();
    ischeckStatus = isComplete ? true : false;

  });
  if (ischeckStatus) {
    return res.status(200).json({
      success: true, message: 'Store All Routes Completed!!', data: routes,
    });
    //res.json(routes);
  }
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

