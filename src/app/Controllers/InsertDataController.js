const JobSheet = require('../models/jobsheet');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const ProductOrder = require('../models/product_order');
const ProductType = require('../models/product_type');
const ProductSeries = require('../models/product_series');
const Welding = require('../models/welding');
const Assemble = require('../models/assemble');
const ProductGroup = require('../models/product_group');
const QualityControl = require('../models/quality_control');
const Warehouse = require('../models/warehouse');
const Department = require('../models/department');
const { ObjectId } = require('mongodb');


const hanldeOrderProduct = async (req, res) => {
    try {             
        getJobSheetCode = req.body.jobsheetCode;
        isCompleted=true;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        console.log(getProductionType);
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            //create Assemble Collection(Product)
            let today = new Date();
            dd = String(today.getDate()).padStart(2, '0');
            mm = String(today.getMonth() + 1).padStart(2, '0');
            yyyy = today.getFullYear();
            createDay = mm + '/' + dd + '/' + yyyy;
            if(getJobSheetCode) 
            {
                await Product.updateMany({ jobsheet_code: getJobSheetCode }, { $set: { product_status: '3', product_assemble_status: '1' } }); 
                await JobSheet.updateMany({ jobsheet_code: getJobSheetCode }, { jobsheet_status: '1' });  
            }    
            isCheckJobsheetCode = await Assemble.findOne({ jobsheet_code: getJobSheetCode }).count();
            console.log('đếm được là', isCheckJobsheetCode);                        
                if (isCheckJobsheetCode === 0) {
                getAssemble = new Assemble({
                    jobsheet_code: getJobSheetCode,
                    assemble_create_date: createDay,
                    assemble_status: '0'
                });
                getData = await getAssemble.save();  
                isCompleted=getData?true:false;                 
            }
        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            //create Welding Collection (Semi-Product)
            let today = new Date();
            dd = String(today.getDate()).padStart(2, '0');
            mm = String(today.getMonth() + 1).padStart(2, '0');
            yyyy = today.getFullYear();
            createDay = mm + '/' + dd + '/' + yyyy;
            if(getJobSheetCode)  
            {
                await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { $set: { semi_product_status: '3', semi_product_welding_status: '1' } });    
                await JobSheet.updateMany({ jobsheet_code: getJobSheetCode }, { jobsheet_status: '1' });            
            }                
            isCheckJobsheetCode = await Welding.find({ jobsheet_code: getJobSheetCode }).count();
            console.log('đếm được là', isCheckJobsheetCode);
            if (isCheckJobsheetCode === 0) {
                getWelding = new Welding({
                    jobsheet_code: getJobSheetCode,
                    welding_create_date: createDay,
                    welding_status: '0'
                });
                getData = await getWelding.save();  
                isCompleted=getData?true:false;             
            }
        }
        if (isCompleted) {
          
            res.json({
                status: 200,
                messege: 'Update field comleted!!!',
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
const hanldeUpdateWelding=async(req,res)=>
{
    getJobSheetCode = req.body.jobsheetCode;
    getSemiProductAssemble=req.body.semi_product_assembler;
    getSemiProductAssemblyDate=req.body.semi_product_assembly_date;
    isCompleted=true;
    if(getJobSheetCode)
    {
        getData= await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { $set:{semi_product_status:'5',semi_product_assembler:getSemiProductAssemble,semi_product_assembly_date:getSemiProductAssemblyDate} }); 
        await QualityControl.findOneAndUpdate({ jobsheet_code: getJobSheetCode }, { quality_control_status: 'Đang hàn mạch' });
       isCompleted= getData?true:false;
    }
    if (isCompleted) {          
        res.json({
            status: 200,
            messege: 'Update field comleted!!!',
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
const handleApproveAssemble =async(req,res)=>
{
    try {
        getJobSheetCode = req.body.jobsheetCode;       
        isCheck = await Product.updateMany({ jobsheet_code: getJobSheetCode }, {
            $set: {
                 product_status: '4'
            }
        });          
        await Assemble.findOneAndUpdate({ jobsheet_code: getJobSheetCode }, { assemble_status:'1' });
        if (isCheck) {          
            return res.json({
                status:200,
                success: true,               
                message: 'Update field comleted!!!'
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
const handleOrderQC =async(req,res)=>
{
    try {
        // Example Generate ............//
        console.log(req.body);
        getJobSheetCode = req.body.jobsheetCode;
        getUser=req.body.getUser;
        let today = new Date();
        dd = String(today.getDate()).padStart(2, '0');
        mm = String(today.getMonth() + 1).padStart(2, '0');
        yyyy = today.getFullYear();
        CurrentDay = mm + '/' + dd + '/' + yyyy;
        const getDateTime = new Date();
        var start = new Date();
        start.setHours(0, 0, 0, 0);
        var end = new Date();
        end.setHours(23, 59, 59, 999);
           // dùng cho Semi
       // mergeCodeQualityControl='QC23L01TP50P001 '   // dùng cho Product       
        //Data get form body.../
        isCheckStatus = true;
        getQCArray = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        const getCode = getJobSheetCode.substring(0,5);
        console.log('giá trị lấy được là',getCode);
        // mergeCodeQualityControl=req.body.mergeCodeQualityControl;
        // mergeCodeQualityControl=req.body.mergeCodeQualityControl;
        // console.log(mergeCodeQualityControl);
        getUSer = req.body.fullname;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
                        //Loop here..........//           
                console.log(getProductionType);                
                isCheckQuantityControl = await QualityControl.find({ jobsheet_code: getJobSheetCode }).count();
                console.log('kiem tra ton tai thành phẩm', isCheckQuantityControl)
                if (isCheckQuantityControl === 0) {
                    console.log('chạy tới đây rồi!!!')
                    getQualityControl = new QualityControl({
                        quality_control_code: 'QC'+getCode+'TP50R001',
                        jobsheet_code: getJobSheetCode,
                        quality_control_create_date: CurrentDay,    
                        user_id:'654ca7ac461ec044452d1c46',                    
                    });
                    getData = await getQualityControl.save();                    
                }
                isCompleted = await Product.updateMany({ jobsheet_code: getJobSheetCode }, { $set: { product_status: '6', product_qc_status: '1' } });
                isCheckStatus = isCompleted ? true : false;
                    
            if (isCheckStatus) {               
                res.json({
                    status: 200,
                    message: 'Update Completed!!',
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
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            //Loop here..........// 
                      
                isCheckQuantityControl = await QualityControl.find({ jobsheet_code: getJobSheetCode }).count();
                console.log('kiem tra ton tai bán thành phẩm', isCheckQuantityControl)
                if (isCheckQuantityControl === 0) {
                    console.log('code thôi!');
                    getQualityControl = new QualityControl({
                        quality_control_code: 'QC'+getCode+'TS50R001',
                        jobsheet_code: getJobSheetCode,
                        quality_control_create_date: CurrentDay, 
                        user_id: '654ca7ac461ec044452d1c46',                    
                    });
                    getData = await getQualityControl.save();                    
                }
                isCompleted = await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { $set: { semi_product_status: '6', semi_product_qc_status: '1' } });
                isCheckStatus = isCompleted ? true : false;  
                              
            if (isCheckStatus) {               
                res.json({
                    status: 200,
                    message: 'Update Completed!!',
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
let handleUpdateQC = async (req, res) => {
    try {
    console.log(req.body);
    getJobSheetCode = req.body.jobsheetCode;   
    getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');    
    getProductionType = getInfo.product_type_code;
    console.log(getProductionType);
    if ((getProductionType == 'P') || (getProductionType == 'R')) {
        isCheck = await Product.find({ jobsheet_code: getJobSheetCode }).count();
        console.log('kiểm tra tồn tại',isCheck); 
        if (isCheck > 0) {
            getProduct = await Product.updateMany({ jobsheet_code: getJobSheetCode }, {
                $set: {
                    product_tester: req.body.product_tester,
                    product_test_date: req.body.product_test_date,
                    product_note: req.body.product_note,
                    product_result: req.body.product_result,
                    product_status: '7',
                }
            });
            if (getProduct) {               
                res.json({
                    status: 200,
                    message: 'Get Data Completed!!',
                });
            }
            else {
                throw new Error('Error connecting Database on Server');
            }
        }
    }
    else if ((getProductionType == 'N') || (getProductionType == 'S')) {
        isCheck = await SemiProduct.find({ jobsheet_code: getJobSheetCode }).count();     
        console.log('kiểm tra tồn tại',isCheck);  
        if (isCheck > 0) {
            getSemiProduct = await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, {
                $set: {
                    semi_product_tester: req.body.product_tester,
                    semi_product_test_date: req.body.product_test_date,
                    semi_product_note: req.body.product_note,
                    semi_product_result: req.body.product_result,
                    semi_product_status: '7',
                }
            });
            if (getSemiProduct) {
               
                res.json({
                    status: 200,
                    message: 'Get Data Completed!!',
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
let hanldeStoreWarehouse = async (req, res) => {
    try {
        console.log(req.body);
        //create Current Day
        let today = new Date();
        dd = String(today.getDate()).padStart(2, '0');
        mm = String(today.getMonth() + 1).padStart(2, '0');
        yyyy = today.getFullYear();
        CurrentDay = mm + '/' + dd + '/' + yyyy;        
        getJobSheetCode = req.body.jobsheetCode;
        console.log(req.body);       
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {           
                isCheckWarehoue = await Warehouse.find({ jobsheet_code: getJobSheetCode }).count();
                console.log('kiem tra ton tai thành phẩm', isCheckWarehoue);
                if (isCheckWarehoue === 0) {
                    isCheckStoreWareHouse=true;
                    getWarehouse = new Warehouse({
                        No_invoice: req.body.No_invoice,
                        jobsheet_code: getJobSheetCode,
                        employee_warehouse:req.body.employee_warehouse,
                        date_storeWarehouse: CurrentDay,                        
                    });                    
                   getData = await getWarehouse.save();                                                       
                 isCompleted = await Product.updateMany({ jobsheet_code: getJobSheetCode }, { product_status: '9'});
            }                    
            isCheckExits = await Product.findOne({
                $and: [{ jobsheet_code: getJobSheetCode }, {
                    $or: [
                        { product_status: { $exists: false } },
                        { 
                            $and: [
                                { product_status: { $ne: '9' } },
                                { product_status: { $ne: '10' } },  
                                { product_status: { $ne: '7' } },                                
                            ]
                        }
                    ]
                }]
            }).count();
           // console.log('giá trị tồn tại cuối cùng là', isCheckExits);
            if (isCheckExits === 0) {
                await JobSheet.updateOne({ jobsheet_code:getJobSheetCode }, { jobsheet_status: '2' });
            }
            if (isCompleted) {                
                res.json({
                    status: 200,
                    message: 'Update Completed!!',
                });
            } else {
                return res.json({
                    status:500,
                    success: false,                
                    message: 'Error connecting Database on Server'
                });
            }
        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {           
                isCheckWarehoue = await Warehouse.find({ jobsheet_code: getJobSheetCode }).count();             
                if (isCheckWarehoue === 0) {
                    isCheckStoreWareHouse=true;
                    getWarehouse = new Warehouse({
                        No_invoice: req.body.No_invoice,
                        jobsheet_code: getJobSheetCode,
                        employee_warehouse:req.body.employee_warehouse,
                        date_storeWarehouse: CurrentDay,                        
                    }); 
                    getData = await getWarehouse.save();                    
                }
                isCompleted = await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { semi_product_status: '9' });            
            isCheckExits = await SemiProduct.findOne({
                $and: [{ jobsheet_code: getJobSheetCode }, {
                    $or: [
                        { semi_product_status: { $exists: false } },
                        { 
                            $and: [
                                { semi_product_status: { $ne: '9' } },
                                { semi_product_status: { $ne: '10' } },        
                                { semi_product_status: { $ne: '7' } },                           
                            ]
                        }                   
                       
                    ]
                }]
            }).count();
            console.log('giá trị tồn tại cuối cùng là', isCheckExits);
            if (isCheckExits === 0) {
                await JobSheet.updateOne({  jobsheet_code:getJobSheetCode }, { jobsheet_status: '2' });
            }
            if (isCompleted) {               
                res.json({
                    status: 200,
                    message: 'Update Completed!!',
                });
            } else {
                return res.json({
                    status:500,
                    success: false,                
                    message: 'Error connecting Database on Server'
                });
            }
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

module.exports = {
    hanldeOrderProduct: hanldeOrderProduct,
    hanldeUpdateWelding:hanldeUpdateWelding,
    handleApproveAssemble:handleApproveAssemble,
    handleOrderQC:handleOrderQC,
    handleUpdateQC:handleUpdateQC,
    hanldeStoreWarehouse:hanldeStoreWarehouse,
   
 }