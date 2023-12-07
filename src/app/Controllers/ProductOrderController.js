const ProductOrder = require('../models/product_order');
const DetailProductOrder = require('../models//detail_product_order');
const IncrementCode = require('../models/increment_code_product_order');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
let index = async (req, res) => {
    try {    
           
            const token = req.headers.token;
            _getData = await ProductOrder.aggregate([
                {
                    $addFields: {
                        user_create_by: {
                            $toObjectId: "$user_create_by"
                        },
                    }
                },
                {
                    $match: {
                        user_create_by: { $exists: true } 
                    }
                },
                // {
                //     $match:{user_create_by:getInfoUser._id}
                // },
                // {
                //     $match: {
                //       $expr: {
                //         $cond: {
                //           if: { $eq: [getInfoUser.roles.isAdmin, 'admin'] },
                //           then: {}, 
                //           else: { $eq: ["$user_create_by", getInfoUser._id] } 
                //         }
                //       }
                //     }
                // },
                {
                    $lookup: {
                        from: "users",
                        let: { userId: "$user_create_by" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$_id", "$$userId"] }
                                }
                            },
                            {
                                $project: { _id: 1, fullname: 1 }
                            }
                        ],
                        as: "detail_user"
                    }
                },
            ]);            
            getData= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getData);  
            if (getData) {
                res.json({
                    status: 200,
                    message: 'Get Data Completed!!',
                    data: getData
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
let store = async (req, res) => {
    try { 
           
        const getProductOrder = new ProductOrder(req.body);
        getProductOrder.production_order_status = '0';
        getProductOrder.production_order_receiver = null;
        let getData = await getProductOrder.save();
        runIncrementInvoice();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                //data: getData,
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
let infotoCreate = async (req, res) => {
    try {
        lastInvoice = await IncrementCode.findOne().sort({ created: -1}).select('invoice_number');
        console.log('dòng cuối cùng:',lastInvoice);
        getDetailProductOrder = await DetailProductOrder.find({ product_order_code: lastInvoice.invoice_number }); 		
        if (lastInvoice) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: lastInvoice, getDetailProductOrder
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
let edit = async (req, res) => {
    try{
    const token = req.headers.token; 
    getId = req.params.id;
    // getData = await ProductOrder.aggregate([
    //     {
    //         $addFields: {
    //             user_create_by: {
    //                 $toObjectId: "$user_create_by"
    //             },              
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "users",
    //             pipeline:[
    //                 {
    //                     $project: {_id:1,fullname:1}
    //                    }
    //             ],
    //             localField: "user_create_by",
    //             foreignField: "_id",
    //             as: "detail_user"
    //         }
    //     },
    //     {
    //         $lookup: {
    //             from: "detail_product_orders",
    //             localField: "product_order_No",
    //             foreignField: "product_order_code",
    //             as: "dataDetail"
    //         }
    //     },
    //     {
    //         $match: { product_order_No: getId }
    //     }
    // ]);
     //fix vesion mongoDB
     _getData = await ProductOrder.aggregate([
        {
            $match: { product_order_No: getId }
        },
        {
            $addFields: {
                user_create_by: {
                    $toObjectId: "$user_create_by"
                },
            }
        },
        {
            $lookup: {
                from: "users",
                let: { userId: "$user_create_by" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$_id", "$$userId"] }
                        }
                    },
                    {
                        $project: { _id: 1, fullname: 1 }
                    }
                ],
                as: "detail_user"
            }
        },
        {
            $lookup: {
                from: "detail_product_orders",
                let: { orderNo: "$product_order_No" },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$product_order_code", "$$orderNo"] }
                        }
                    }
                ],
                as: "dataDetail"
            }
        }
    ]);
    getData= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getData);  
    if (getData) {
        return res.json({
            status:200,
            success: true, message: 'Infomation Field need to edit!!', data: getData,
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
        getData = await ProductOrder.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await ProductOrder.findOne({ _id: id });
            return res.json({
                status:200,
                success: true, message: 'Infomation field has been updated !!!'
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
let showdetail = async (req, res) => {
    try {
        const token = req.headers.token; 
        getId = req.params.id;
       let _getData = await DetailProductOrder.find({ product_order_code: getId });   
       getData= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getData);    
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData
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
let approve = async (req, res) => {
    try{
    id = req.params.id;
    getdata = req.body.production_order_receiver;
    updateInfo = new ProductOrder({
        _id: req.params.id,
        production_order_status: '1',
        production_order_receiver: getdata,
    });
    getData = await ProductOrder.findByIdAndUpdate(id, { $set: updateInfo });
    if (getData) {
        return res.json({
            status:200,
            success: true, message: 'This field has been updated!!!',
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
let reapprove = async (req, res) => {
    try{
    id = req.params.id;
    updateInfo = new ProductOrder({
        _id: req.params.id,
        production_order_status: '0',
        production_order_receiver: null,
    });
    getData = await ProductOrder.findByIdAndUpdate(id, { $set: updateInfo });
    if (getData) {
        return res.json({
            status:200,
            success: true, message: 'This field has been updated!!!',
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
let cancel = async (req, res) => {
    try{
    id = req.params.id;
    updateInfo = new ProductOrder({
        _id: req.params.id,
        production_order_status: '2',
        production_order_receiver: null,
    });
    getData = await ProductOrder.findByIdAndUpdate(id, { $set: updateInfo });
    if (getData) {
        return res.json({
            status:200,
            success: true, message: 'This field has been updated!!!',
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
        let id = req.query.id;
        getIDDetail = await DetailProductOrder.findOne({ product_order_code: id });
        if (getIDDetail) {
            await DetailProductOrder.findByIdAndRemove({ _id: getIDDetail._id });
        }
        getId = await ProductOrder.findByIdAndRemove({ _id: id });

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
let runIncrementInvoice = async (req, res) => {
    let currentYear = new Date().getFullYear().toString().slice(-2);  
        //get year in the last record
        getlastInvoice=await IncrementCode.findOne().sort({ created: -1 }).select('invoice_number');        
        let invoiceNumber =getlastInvoice.invoice_number;
        let getlastYear = invoiceNumber.match(/YCSX(\d+)\.\d+/);
        let _getlastYear = getlastYear ? getlastYear[1] : null;
        console.log(_getlastYear); 
        latest = await IncrementCode.findOne().sort({ invoice_number: -1 }).limit(1);      
        string = latest.invoice_number.match(/\.(\d+)/);
        getvalue = parseInt(string[1]);       
        getvalue += 1;                      
        invoice_number = 'YCSX'+currentYear+'.'+ String(getvalue).padStart(3, '0');
        const getInvoice = new IncrementCode({
            invoice_number: invoice_number,
        });
        await getInvoice.save();
    }
let getRoles= async (data) => {
    getData = await User.aggregate([
        {
            $lookup: {
                from: "roles",
                localField: "role_id",
                foreignField: "role_code",
                as: "roles",
            },
        },
        { $match: { '_id': data } },
    ]);
    return getData
}
module.exports = {
    index: index,
    store: store,
    edit: edit,
    update: update,
    showdetail: showdetail,
    approve: approve,
    reapprove: reapprove,
    cancel: cancel,
    destroy: destroy,
    infotoCreate: infotoCreate,
    runIncrementInvoice: runIncrementInvoice,
    getRoles:getRoles
}