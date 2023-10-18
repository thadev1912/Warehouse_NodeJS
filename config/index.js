
const mongoose = require('mongoose');
let connectDB=async()=>{
  mongoose.connect('mongodb://127.0.0.1:27017/mongodb')
  .then(() =>  console.log('Connect MongoDB Completed!!.'))
}
module.exports=connectDB;
