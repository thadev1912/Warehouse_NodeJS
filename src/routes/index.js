

const user=require('./user');
const region=require('./region');
const department=require('./department');
const position=require('./position');
const checkLogin =require('../app/middlewares/auth')
function route(app)
{
app.use('/account',user); 
app.use('/region',checkLogin.verifyToken,region);
app.use('/deparment',department);
app.use('/position',position);
}

module.exports = route;
