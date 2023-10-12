const user=require('./user');
const role=require('./role');
const region=require('./region');
const department=require('./department');
const position=require('./position');
const Auth =require('../app/middlewares/auth')
const Permision =require('../app/middlewares/permission')
function route(app)
{
app.use('/account',user); 
app.use('/role',role); 
app.use('/region',region);
app.use('/deparment',department);
app.use('/position',position);
}
module.exports = route;
