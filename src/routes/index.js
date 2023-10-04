

const user=require('./user');
const region=require('./region');
const middlewareAuthentication =require('../app/middlewares/auth')
function route(app)
{
   
app.use('/user',user); 
app.use('/region',region);
}

module.exports = route;
