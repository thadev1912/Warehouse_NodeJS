

const user=require('./user');
const kho=require('./kho');
const vattu=require('./vattu');
const nhacungcap=require('./nhacungcap');
const lydonhap=require('./lydonhap');
const lydoxuat=require('./lydoxuat');
const donvitinh=require('./donvitinh');
const phieunhapkho=require('./phieunhapkho');
const phieuxuatkho=require('./phieuxuatkho');
const chitietnhapkho=require('./chitietnhapkho');
const chitietxuatkho=require('./chitietxuatkho');
const invoice_nhap=require('./invoice_nhap');
const invoice_xuat=require('./invoice_xuat');
const middlewareAuthentication =require('../app/middlewares/auth')
function route(app)
{
   
app.use('/user',user); 
app.use('/kho',kho);
app.use('/vattu',vattu);
app.use('/nhacungcap',nhacungcap);
app.use('/lydonhap',lydonhap);
app.use('/lydoxuat',lydoxuat);
app.use('/donvitinh',donvitinh);
app.use('/phieunhapkho',phieunhapkho);
app.use('/phieuxuatkho',phieuxuatkho);
app.use('/chitietnhapkho',chitietnhapkho);
app.use('/chitietxuatkho',chitietxuatkho);
app.use('/invoice_nhap',invoice_nhap);
app.use('/invoice_xuat',invoice_xuat);
}

module.exports = route;
