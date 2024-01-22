const ProductOrder = require('../models/product_order');
const ProductType = require('../models/product_type');
const DetailProductOrder = require('../models//detail_product_order');
const IncrementCode = require('../models/increment_code_product_order');
const User = require('../models/user');
const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
const { paginate1 } = require('../../helper/pagination');
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
                    $sort: {
                        created: -1 
                    }
                },

              
                
            ]);            
            getData= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getData);  
            if (getData) {
                res.json({
                    status: 200,
                    message: 'Get Data Completed',
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
let indexSemiProduct = async (req, res) => {
    try {    
           getTypeProductOrder=parseInt(req.params.id);   
           console.log('giá trị nhận được từ params',getTypeProductOrder);       
            const token = req.headers.token;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;   
            const getSearch = req.body.getSearch || null;  
            console.log(getSearch);
            const pipeline = [              
                {
                    $addFields: {
                        user_create_by: {
                            $toObjectId: "$user_create_by"
                        },
                    }
                },
                {
                    $match: {
                        
                            $and:[
                               { user_create_by: { $exists: true } }, 
                               {  product_order_type:0},                             
                            ]                        
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
                    $sort: {
                        created: -1 
                    }
                }    
            ]; 
            if (getSearch) {
                pipeline.push(
                    {
                        $match: {
                            $or:[                          
                              { product_order_No: { $regex: getSearch, $options: "i" }} , 
                              { production_order_invoice: { $regex: getSearch, $options: "i" }} ,                           
                            ]
                        }
                    },
                     );
              }
            result = await paginate1(ProductOrder, {}, page, limit,true, pipeline,token); 
            const { getData, totalPages, currentPage, pageSize, totalCount } = result; 
             
            if (getData) {
                res.json({
                    status: 200,
                    message: 'Get Data Completed',
                    data: await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,getData),
                    totalPages,
                    currentPage,
                    pageSize,
                    totalCount
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
let indexProduct = async (req, res) => {
    try {    
           getTypeProductOrder=parseInt(req.params.id);   
           console.log('giá trị nhận được từ params',getTypeProductOrder);       
            const token = req.headers.token;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;   
            const getSearch = req.body.getSearch || null;  
            console.log(getSearch);
            const pipeline = [              
                {
                    $addFields: {
                        user_create_by: {
                            $toObjectId: "$user_create_by"
                        },
                    }
                },
                {
                    $match: {
                        
                            $and:[
                               { user_create_by: { $exists: true } }, 
                               {  product_order_type:1},                             
                            ]                        
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
                    $sort: {
                        created: -1 
                    }
                }    
            ]; 
            if (getSearch) {
                pipeline.push(
                    {
                        $match: {
                            $or:[                          
                              { product_order_No: { $regex: getSearch, $options: "i" }} , 
                              { production_order_invoice: { $regex: getSearch, $options: "i" }} ,                           
                            ]
                        }
                    },
                     );
              }
            result = await paginate1(ProductOrder, {}, page, limit,true, pipeline,token); 
            const { getData, totalPages, currentPage, pageSize, totalCount } = result; 
             
            if (getData) {
                res.json({
                    status: 200,
                    message: 'Get Data Completed',
                    data: await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,getData),
                    totalPages,
                    currentPage,
                    pageSize,
                    totalCount
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
        console.log(req.body);   
        const getProductOrder = new ProductOrder(req.body);
        getProductOrder.production_order_status = '0';
        getProductOrder.production_order_receiver = null;
        ArrDetailProduct=req.body.ArrDetailProduct;
        //check Id exits
        checkId = await ProductOrder.find({ product_order_No: req.body.product_order_No }).count();
        if (checkId > 0) {
            return res.json({
                status: 422,
                success: true, message: 'This ID exits',
            });
        }
          let getData = await getProductOrder.save(); 
          runIncrementInvoice();      
        await Promise.all(ArrDetailProduct.map(async (data)=>
        {
           // console.log('giá trị duyệt được là',data);
            const getDetailProduct = new DetailProductOrder({
                product_order_code:getData.product_order_No,
                detail_product_order_name: data.detail_product_order_name,
                detail_product_order_quantity:data.detail_product_order_quantity,
                detail_product_order_unit:data.detail_product_order_unit,
                detail_product_order_type:data.detail_product_order_type,
                detail_product_order_detail: data.detail_product_order_detail,
                detail_product_order_purpose: data.detail_product_order_purpose,
            });
            await getDetailProduct.save();
        }));   
            if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field completed',
                //data: getData,
            });
            setLogger.logStore(getInfoUser,req);
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
        const token = req.headers.token;
        lastInvoice = await IncrementCode.findOne().sort({ created: -1}).select('invoice_number');
        getProductType=await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProductType.find());        
        getDetailProductOrder = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await DetailProductOrder.find({ product_order_code: lastInvoice.invoice_number })); 		
        if (lastInvoice) {
            res.json({
                status: 200,
                messege: 'Add new field completed',
                data: lastInvoice, getDetailProductOrder,getProductType
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
            success: true, message: 'Infomation Field need to edit', data: getData,
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
        console.log(req.body);
        req.body.updated=new Date();
        let id = new ObjectId(req.params.id);  
        ArrDetailProduct=req.body.ArrDetailProduct;    
        getData = await ProductOrder.findByIdAndUpdate(id, { $set: req.body });
        getInfoProduct=await ProductOrder.find({_id:id});
        console.log('giá trị cần info là:',getInfoProduct);
        checkExits=await DetailProductOrder.find({product_order_code:getInfoProduct[0].product_order_No}).countDocuments();
        console.log(checkExits);
        if(checkExits>0)
        {
            await DetailProductOrder.deleteMany({product_order_code:getInfoProduct[0].product_order_No});
        }
        if(ArrDetailProduct)
        {
            await Promise.all(ArrDetailProduct.map(async (data)=>            {
               
                    const getDetailProduct = new DetailProductOrder({
                    product_order_code:getData.product_order_No,
                    detail_product_order_name: data.detail_product_order_name,
                    detail_product_order_quantity:data.detail_product_order_quantity,
                    detail_product_order_unit:data.detail_product_order_unit,
                    detail_product_order_type:data.detail_product_order_type,
                    detail_product_order_detail: data.detail_product_order_detail,
                    detail_product_order_purpose: data.detail_product_order_purpose,
                });
                await getDetailProduct.save();
            }));   
        }
        if (getData) {
            getNewData = await ProductOrder.findOne({ _id: id });
             res.json({
                status:200,
                success: true, message: 'Infomation field has been updated'
            });
            setLogger.logUpdate(getInfoUser,req);
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
                message: 'Get Data Completed',
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
        setLogger.logAprrove(getInfoUser,req);
        return res.json({
            status:200,
            success: true, message: 'This field has been updated',
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
        setLogger.logAprrove(getInfoUser,req);
        return res.json({
            status:200,
            success: true, message: 'This field has been updated',
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
        setLogger.logCancel(getInfoUser,req);
        return res.json({
            status:200,
            success: true, message: 'This field has been updated',
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
            setLogger.logDelete(getInfoUser,req); 
            return res.json({
                status:200,
                success: true, message: 'This field has been removed',
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
     //currentYear ='23'
    let currentYear = new Date().getFullYear().toString().slice(-2);  
        //get year in the last record
        getlastInvoice=await IncrementCode.findOne().sort({ created: -1 }).select('invoice_number');        
        let invoiceNumber =getlastInvoice.invoice_number;
        let getlastYear = invoiceNumber.match(/YCSX(\d+)\.\d+/);
        let _getlastYear = getlastYear ? getlastYear[1] : null;
       // console.log(_getlastYear); 
      //  latest = await IncrementCode.findOne().sort({ invoice_number: -1 }).limit(1);      
      let latest = await IncrementCode.findOne({ invoice_number: { $regex: 'YCSX' + currentYear } }).sort({ invoice_number: -1 });    
        string = latest.invoice_number.match(/\.(\d+)/);
        getvalue = parseInt(string[1]);       
        getvalue += 1;                      
        invoice_number = 'YCSX'+currentYear+'.'+ String(getvalue).padStart(3, '0');
        const getInvoice = new IncrementCode({
            invoice_number: invoice_number,
        });
        await getInvoice.save();
    }
let runIncrementInvoicefix = async (getDay) => {
        console.log(getDay);
        let currentYear = new Date(getDay).getFullYear().toString().slice(-2);
     //   let currentYear = new Date().getFullYear().toString().slice(-2);  
            //get year in the last record
            getlastInvoice=await IncrementCode.findOne().sort({ created: -1 }).select('invoice_number');        
            let invoiceNumber =getlastInvoice.invoice_number;
            let getlastYear = invoiceNumber.match(/YCSX(\d+)\.\d+/);
            let _getlastYear = getlastYear ? getlastYear[1] : null;
            if(currentYear!==_getlastYear) 
                {
                    getvalue='001';
                    invoice_number = 'YCSX'+currentYear+'.'+getvalue;
                    const getInvoice = new IncrementCode({
                        invoice_number: invoice_number,
                    });
                    await getInvoice.save();
                }       
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
    indexSemiProduct:indexSemiProduct, 
    indexProduct:indexProduct, 
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
    runIncrementInvoicefix:runIncrementInvoicefix,
    getRoles:getRoles
}