
const mongoose = require('mongoose');
let connectDB=async()=>{
  mongoose.connect('mongodb://127.0.0.1:27017/mymongo')
  .then(() =>  console.log('Connection mongoDB has been established successfully.'))
}
module.exports=connectDB;
