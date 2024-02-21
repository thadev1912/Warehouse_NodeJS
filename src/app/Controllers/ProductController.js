const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
let index = async (req, res) => {
    try {   
      const token = req.headers.token;
      getData = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await Product.aggregate([
        {
            $match:{
                $and:[
                    {product_status:'9'},
                    {product_result:'1'},
                ]
            }
        },
        {
            $sort: {
                created: -1 
            }
        },     
    
      ]));
      getSemiProduct= await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await SemiProduct.aggregate([
        {
            $match:{
                $and:[
                    {semi_product_status:'9'},
                    {semi_product_result:'1'},
                    {semi_product_used:'0'}
                ]
            }
        }
      ]));     
      if (getData) {
        res.json({
            status: 200,
            messege: 'Get data comleted',
            getData,getSemiProduct
        });
    }
    else {
        return res.json({
            status: 500,
            success: false,
            message: 'Error connecting Database on Server'
        });
    }

    }
    catch (err) {
        console.log(err);
         res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let create = async (req, res) => {
    try {        
        const token = req.headers.token;
        const getProduct = new Product(req.body);          
      //  getOldSemiProductLot = req.body.old_semi_product_lot;
        getSemiProductLot = req.body.semi_product_lot;
        if(getSemiProductLot)
        {
            await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { semi_product_used: '1' });
        }        
        let getData = await getProduct.save();
        if (getData) {
            res.json({
                status: 200,
                message: 'Add new field comleted',
               // data: getData,
            });            
        }
        else {
            res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
        }      
    
    catch (err) {
        console.log(err);
         res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
let edit = async (req, res) => {
    try {
        res.json("Bạn gọi tôi à");
    }
    catch (err) {
        console.log(err);
            res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
let update = async (req, res) => {
    try {
        req.body.updated=new Date();
        let id = req.params.id;
        getOldSemiProductLot = req.body.old_semi_product_lot;
        getSemiProductLot = req.body.semi_product_lot;
        if(getOldSemiProductLot)            {
            await SemiProduct.findOneAndUpdate({ semi_product_lot: getOldSemiProductLot }, { semi_product_used: '0' }); 
        }          
        if(getSemiProductLot)
        {
            await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { semi_product_used: '1' });
        }      
        getData = await Product.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await Product.findOne({ _id: id });
            res.json({
                status:200,
                success: true, message: 'Infomation field has been updated'
            });            
        }
        else {
             res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    } 
    catch (err) {
        console.log(err);
           res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
let destroy = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await Product.findByIdAndRemove({ _id: id });
        if (getId) {
             res.json({
                status:200,
                success: true, message: 'This field has been removed',
            });           
        }
        else {
             res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
         res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
}