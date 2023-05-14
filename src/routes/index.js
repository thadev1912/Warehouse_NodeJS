

const sinhvien=require('./sinhvien');
const tintucdatxanh=require('./tintucdatxanh');
const lophoc=require('./lophoc');
const user=require('./user');
const kho=require('./kho');
const vattu=require('./vattu');
const middlewareAuthentication =require('../app/middlewares/auth')
function route(app)
{
   
app.use('/user',user); 
app.use('/sinhvien',sinhvien);
app.use('/',tintucdatxanh); 
app.use('/tintucdatxanh',tintucdatxanh); 
app.use('/lophoc',lophoc); 
app.use('/kho',kho);
app.use('/vattu',vattu);
}

module.exports = route;
