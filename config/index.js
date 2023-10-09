
const mongoose = require('mongoose');
let connectDB=async()=>{
  mongoose.connect('mongodb://127.0.0.1:27017/mongodb')
  .then(() =>  console.log('Kết nối CSDL MongoDB thành công!!!.'))
}
module.exports=connectDB;
