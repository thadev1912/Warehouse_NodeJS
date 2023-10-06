

const user=require('./user');
const region=require('./region');
const department=require('./department');
const position=require('./position');
const Auth =require('../app/middlewares/auth')
function route(app)
{
app.use('/account',user); 
app.use('/region',region);
app.use('/deparment',Auth.checkLogin,department);
app.use('/position',position);
}
module.exports = route;
