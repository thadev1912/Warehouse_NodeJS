const Department = require('../models/department');
const cryptJSon = require('../../helper/cryptJSon');
//mã hóa
// const crypto = require("crypto");
// const algorithm = "aes-256-cbc";
// const initVector=Buffer.from(process.env.INIT_VECTOR_KEY,'hex');
// console.log(initVector);
// const Securitykey=Buffer.from(process.env.SECURITY_AES_KEY,'hex');
// // the cipher function
// const cipher = crypto.createCipheriv(algorithm, Securitykey, initVector);
//     //hàm dùng để giải mã
//   const decipher = crypto.createDecipheriv('aes-256-cbc', Securitykey, initVector);
let index = async (req, res) => {
    try {
        const token = req.headers.token;    
        let _getData = await Department.find({});      
      getData= await cryptJSon.encryptData(token,_getData);   
      const covertData=await cryptJSon.decryptData(token,getData) 
        if (getData) {
           return res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,covertData
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }
}
let create = async (req, res) => {
    try {
        const getDepartment = new Department(req.body);      
        checkId = await Department.find({ department_code:req.body.department_code}).count();      
        if (checkId>0) {
            return res.json({
                 status:200,
                 success: true,
                 message: 'This ID exits!!',
            });
        }
        let getData = await getDepartment.save();       
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
            });
        }
        else
        {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
			
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }
}

let edit = async (req, res) => {
    try {
        id = req.params.id;
        getId = await Department.findOne({ _id: id });
        if (getId) {
            return res.json({
                status:200,
                success: true, message: 'Infomation Field need to edit!!', data: getId,
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });

        }
    } 
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}

let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await Department.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await Department.findOne({ _id: id });
            return res.json({
                status:200,
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    } 
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
let destroy = async (req, res) => {
    try {
        let id = req.params.id;
        getId = await Department.findByIdAndRemove({ _id: id });
        if (getId) {
            return res.json({
                status:200,
                success: true, message: 'This field has been removed!!!',
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}

let getdecryptData =async (req,res)=>{
    //data="e42f490b79f27d58643a8fa96e5a7cee7777a70d28f7537dd085d7b095750aca36a8bf9880ea1ee8099547a9fa6d1413951183d9406d286ebf417554f7c69de4879320f7938eb946fff98b4cb1bd7b9a3b551b1b94e63db5c3f579cac62bf725ed790eb63ec764b3b5da9c56e22752bc6a0f96ee1d650da83b67be17d0ae5f682630410d6c588d9ced5c6f36adff01b66d3692b2f571b64526ab988d1e858393d5d9cb949697d0c0a66d8d001421228b9a9f3658936314e5971ba99489a993a1606b6097924b0b52dff74fc8e377dddfefff68302832d6ff94cf4d4cdf07afae66ee3d77e2776e97b47cfa333772e20d8d0398a2d1992ce90bea4d82b380790c63e80d41ba915b1c534e115b70815d32c71dcd15a8bcce7bf73469a31b641af28a2bc70409b041a66685812960e50961a39bd8f73c03823980130fb9bdd54bd4c007d4ac77fe0f458f34f40fbbed69899e392dc79d21faf6b7b4b156427f673ef0f5a3211bfa3ea50ad3948d9590492fb24c3ae19f4becaf65e3bdf903d7615af83b1bd839339c2a5e693d676b7912168fe67b7e8c99847503228289eb9ebe9a24917907515b8b733ee073a538d25cf8f410ff388928bc46c5cbcbc00411a6774d64df89442bc2a9bec9d4474b435ce6eef35859f9008057297a347cad092cc99ad5e71de6b41e3d367c2af72a44af3f560e7f93d21215f409521a0616c3c2347b2484888598c483727f441783ca0302495c77e7228442d43674d1b6f2d0904b246b5f2dc2f6729b48b3dd5458be8ab2a77c200c038dec58d4ffd0aace34f0e3f693aaea6f55a464056aab159f263ae422f0262823d82b88626eef0deca77aa4b1d9de05a00c09b54cb31528431a7e9725c4f6c00756635417d8ae881b5e612a491baaa39bf99a5acce8fe9ca342d8e5ec7fec2a58003b41d0042cdcbdfa76f4197b1980730cad6bf58386cb814d67d693a4698f4d26f60dcccf6506c6098bdb69074e560c324adb05986072ad38b94a129c2d979d74c07709379f43c395d1f36f7d6918849116b7c278e3f37cf5e839551b8695c81eb0d111e332aa165507253288c6ea650089d783a094d7f1d16c23bd18274374a53ea3a7b2b67663767863103ae62cf073e5cfe5763982dc4b48d708453db4c279409b8f2973f56439544816d60782b3f1afb32f7313e7e492178df5cf42290b1f252e9f81f2a7699064fa31f5ee307f653177465f37165664267cf2c22ec3ec48a1c108ab9b3d9e84dfb1585af9eb58a3188ddc812ce5127b2927f5d24a73d595f8236b838689981ac0392ecd8d7a9197d774e98ed05e70afe8eb";
   data="e42f490b79f27d58643a8fa96e5a7cee7777a70d28f7537dd085d7b095750aca36a8bf9880ea1ee8099547a9fa6d1413951183d9406d286ebf417554f7c69de4879320f7938eb946fff98b4cb1bd7b9a3b551b1b94e63db5c3f579cac62bf725ed790eb63ec764b3b5da9c56e22752bc6a0f96ee1d650da83b67be17d0ae5f682630410d6c588d9ced5c6f36adff01b66d3692b2f571b64526ab988d1e858393d5d9cb949697d0c0a66d8d001421228b9a9f3658936314e5971ba99489a993a1606b6097924b0b52dff74fc8e377dddfefff68302832d6ff94cf4d4cdf07afae66ee3d77e2776e97b47cfa333772e20d8d0398a2d1992ce90bea4d82b380790c63e80d41ba915b1c534e115b70815d32c71dcd15a8bcce7bf73469a31b641af28a2bc70409b041a66685812960e50961a39bd8f73c03823980130fb9bdd54bd4c007d4ac77fe0f458f34f40fbbed69899e392dc79d21faf6b7b4b156427f673ef0f5a3211bfa3ea50ad3948d9590492fb24c3ae19f4becaf65e3bdf903d7615af83b1bd839339c2a5e693d676b7912168fe67b7e8c99847503228289eb9ebe9a24917907515b8b733ee073a538d25cf8f410ff388928bc46c5cbcbc00411a6774d64df89442bc2a9bec9d4474b435ce6eef35859f9008057297a347cad092cc99ad5e71de6b41e3d367c2af72a44af3f560e7f93d21215f409521a0616c3c2347b2484888598c483727f441783ca0302495c77e7228442d43674d1b6f2d0904b246b5f2dc2f6729b48b3dd5458be8ab2a77c200c038dec58d4ffd0aace34f0e3f693aaea6f55a464056aab159f263ae422f0262823d82b88626eef0deca77aa4b1d9de05a00c09b54cb31528431a7e9725c4f6c00756635417d8ae881b5e612a491baaa39bf99a5acce8fe9ca342d8e5ec7fec2a58003b41d0042cdcbdfa76f4197b1980730cad6bf58386cb814d67d693a4698f4d26f60dcccf6506c6098bdb69074e560c324adb05986072ad38b94a129c2d979d74c07709379f43c395d1f36f7d6918849116b7c278e3f37cf5e839551b8695c81eb0d111e332aa165507253288c6ea650089d783a094d7f1d16c23bd18274374a53ea3a7b2b67663767863103ae62cf073e5cfe5763982dc4b48d708453db4c279409b8f2973f56439544816d60782b3f1afb32f7313e7e492178df5cf42290b1f252e9f81f2a7699064fa31f5ee307f653177465f37165664267cf2c22ec3ec48a1c108ab9b3d9e84dfb1585af9eb58a3188ddc812ce5127b2927f5d24a73d595f8236b838689981ac0392ecd8d7a9197d774e98ed05e70afe8eb";
    _decryptData=await cryptJSon.decryptJson(data);
    covertData=JSON.parse(_decryptData);
     console.log('giá trị đã được mã hóa lại!!!',covertData);
     res.json({
        data: covertData,
     })
}


module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,    
    getdecryptData:getdecryptData
}