const express = require('express');
const app = express();
const http = require("http");
const https = require('https');
const fs = require('fs');
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
const i18n = require('./src/helper/languague');
const AllRoutersName = require('./src/app/models/all_routes_name');
const setIvoince = require('./src/helper/setIvoince');
const runcronJob= require('./src/helper/cronJob');
//const initBot=require('./src/helper/telegram');
//initBot.TelegramService();
runcronJob.startCronJob();  //Cron auto
app.use(cors());
app.use(i18n.init);
app.disable('x-powered-by');
//Allow Method
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR");
  if (req.headers.origin) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  }
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});  
  }
  next();
 }); 
app.use(session({
  cookie: { maxAge: 60000 },
  store: new session.MemoryStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));
//config Socket IO
const server = http.createServer(app);
const socketService = require('./src/helper/socketIO'); //mới thêm
socketService.initializeSocket(server);
global.io = socketService.getIO();
app.use(flash());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()) 
app.use(bodyParser.urlencoded({ extended: true }));
route(app);
connectDB();
//HTTPS SSL
// const options = {
//   key: fs.readFileSync('/etc/keyssl_api-product/privkey.pem'),
//   cert: fs.readFileSync('/etc/keyssl_api-product/fullchain.pem')
// };
// const server_https = https.createServer(options, app);
// server_https.listen(process.env.PORT_HTTPS,process.env.SERVER_URL, async() => {
//  await setIvoince.setInvoice();   
//   console.log('Server is running on port 3001');
// });
//Config HTTP NO SSL
app.listen(process.env.PORT_HTTP,process.env.SERVER_URL, async() => {
  try{
    console.log(`Server running on ${process.env.SERVER_URL}:${process.env.PORT_HTTP}`)
    await setIvoince.setInvoice();   
  }
  catch (error) {
    console.log('Error occurred:', error);
  }
})
server.listen(process.env.SOCKET_PORT, process.env.SERVER_URL, () => {
  console.log(`Chat System already open on ${process.env.SERVER_URL}:${process.env.SOCKET_PORT}`);
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
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Xử lý lỗi của Multer ở đây, ví dụ: gửi thông báo lỗi cho người dùng
    res.status(413).send('File too large');
    console.log('File too large');
  } else {
    // Nếu không phải lỗi của Multer, chuyển sang middleware xử lý lỗi khác
    next(err);
  }
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

