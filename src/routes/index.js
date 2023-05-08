

const sinhvien=require('./sinhvien');
const tintucdatxanh=require('./tintucdatxanh');
const lophoc=require('./lophoc');
const user=require('./user');
const middlewareAuthentication =require('../app/middlewares/auth')
function route(app)
{
app.use('/user',user); 
app.use('/sinhvien',middlewareAuthentication.verifyToken,sinhvien);
app.use('/',tintucdatxanh); 
app.use('/tintucdatxanh',tintucdatxanh); 
app.use('/lophoc',lophoc); 

}

module.exports = route;
