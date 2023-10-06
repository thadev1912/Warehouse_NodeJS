

const user=require('./user');
const region=require('./region');
const checkLogin =require('../app/middlewares/auth')
function route(app)
{
app.use('/account',user); 
app.use('/region',checkLogin.verifyToken,region);
}

module.exports = route;
