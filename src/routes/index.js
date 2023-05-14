

const sinhvien=require('./sinhvien');
const user=require('./user');
const kho=require('./kho');
const vattu=require('./vattu');
const nhacungcap=require('./nhacungcap');
const lydonhap=require('./lydonhap');
const middlewareAuthentication =require('../app/middlewares/auth')
function route(app)
{
   
app.use('/user',user); 
app.use('/sinhvien',sinhvien);
app.use('/kho',kho);
app.use('/vattu',vattu);
app.use('/nhacungcap',nhacungcap);
app.use('/lydonhap',lydonhap);
}

module.exports = route;
