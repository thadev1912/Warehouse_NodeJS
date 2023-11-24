const express = require('express');
const app = express();
const http = require("http");
const port = 8080;
require('dotenv').config()
const route = require('./src/routes/index');
const path = require('path');
const connectDB = require('./config');
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
const setIvoince = require('./src/helper/setIvoince');
const updateSim = require('./src/helper/updateSim');
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
app.use(express.static(path.join(__dirname, 'public')));
//midleware
app.use(express.json()) 
app.use(bodyParser.urlencoded({ extended: true }));
route(app);
connectDB();
app.listen(process.env.PORT,process.env.SERVER_URL, async() => {
  try{
    console.log(`Server running on ${process.env.SERVER_URL}:${process.env.PORT}`)
    await setIvoince.setInvoice();
    await updateSim.updateStatusSim();    
  }
  catch (error) {
    console.log('Error occurred:', error);
  }
})
server.listen(process.env.SOCKET_PORT, process.env.SERVER_URL, () => {
  console.log(`Chat System already open on ${process.env.SERVER_URL}:${process.env.SOCKET_PORT}`);
});
//***********Socket IO*******************//
//Task: get token from api
//provider token for socket..
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
//Config Swagger Document
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
//Midleware Static View
app.use(express.static('public'));
app.set('view engine', 'ejs');

//Api get all Router Name
app.get('/api/routes', (req, res) => {
  ischeckStatus = true;
  const allRoutes = expressListEndpoints(app);
  const updatedRoutes = allRoutes.map(route => {
    const secondSlashIndex = route.path.indexOf('/', 1); // Find position '/' the second
    if (secondSlashIndex !== -1) {
      route.path = route.path.slice(secondSlashIndex); // Get part last string  '/'
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
  }
});
//middleware for wrong URL
app.all('*', (req, res) => {
  res.status(404);
  if (req.accepts('json')) {
    res.json({
      status: 404,
      messege: 'Incorrect in your url API! Please check again',     
  }); 
  } else {
    res.type('txt').send(" Page 404 Not Found");
  }
});

