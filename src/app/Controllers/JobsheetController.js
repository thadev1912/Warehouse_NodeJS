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
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const { ObjectId } = require('mongodb');
let index = async (req, res) => {
    try {        
        const token = req.headers.token; 
        let getproductOrderNo =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await ProductOrder.find().select('product_order_No'));
        let getproductType =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await ProductType.find());
        let getproductSeries =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await ProductSeries.find());
      //  let getData =await cryptJSon.encryptData(token,await JobSheet.find({}));
      let getData=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await JobSheet.aggregate([
        {
            $addFields: {
                user_id: {
                    $toObjectId: "$user_id"
                },
            }
        },       
        {
            $lookup: {
                from: "users",
                let: { userId: "$user_id" },
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
       
       ]));
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData, getproductOrderNo, getproductType, getproductSeries
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
    try{
    const token = req.headers.token; 
    let getproductOrderNo =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await ProductOrder.find().select('product_order_No'));
    let getproductType =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await ProductType.find());
    let getproductSeries =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductSeries.find());
    if (getproductOrderNo && getproductType && getproductSeries) {
        return res.json({
            status:200,
            success: true, message: 'Infomation Field need to edit!!', getproductOrderNo, getproductType, getproductSeries
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
let store = async (req, res) => {
    try {
        const token = req.headers.token; 
        console.log(req.body);
        const getDateTime = new Date();
        const month = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
        //Rule: 21A02     N    1     R     N     010
        //------------------------------------------------------------------------
        createQuantity = String(req.body.product_quantity).padStart(3, '0');  //get quantity
        createProductionStyle = req.body.production_style; //get type Production (N or F)
        createProductionSeries = req.body.product_series_code; //get Series Production 
        createProductionType = req.body.product_type_code; // ( Semi or Product) ;
        countProductSeries= await countSeriesinDay(req.body.product_series_code);          
        countProductSeries+=1   
        createQuantityProductSeries = countProductSeries; 
        //createQuantityProductSeries = '1';               
        createDay = String(getDateTime.getDate()).padStart(2, '0');
        createMonth = month[getDateTime.getMonth()];
        createYear = getDateTime.getFullYear(); createYear = createYear.toString().substr(-2);
        mergeCodeJobsheet = createYear + createMonth + createDay + createProductionType + createQuantityProductSeries + createProductionSeries + createProductionStyle + createQuantity;
        //--------------------------------------- ---------
        //*****************RUN LOOP******************** */  
        //rule Product: (R & P)  --Semi-Product ( N & S)   
        if ((createProductionType == 'P') || (createProductionType == 'R')) {
            for (let i = 1; i <= req.body.product_quantity; i++) {
                let incrementQuantity = String(i).padStart(3, '0');
                mergeProductCode = createYear + createMonth + createDay + createProductionType + createQuantityProductSeries + createProductionSeries + incrementQuantity + createProductionStyle + createQuantity;
                mergeProductSerial = createMonth + createDay + createYear + createProductionType + createQuantityProductSeries + createProductionSeries + incrementQuantity + createProductionStyle + createQuantity;
                const getProduct = new Product({
                    jobsheet_code: mergeCodeJobsheet,
                    product_code: mergeProductCode,
                    product_serial: mergeProductSerial,
                    product_id: req.body.product_id,
                    product_name: req.body.product_name,
                    product_unit: req.body.product_unit,
                    product_status: '0',
                    product_assemble_status: '0',
                    product_qc_status: '0',
                });
                await getProduct.save();
            }

        }
        else if ((createProductionType == 'N') || (createProductionType == 'S')) {
            for (let i = 1; i <= req.body.product_quantity; i++) {
                let incrementQuantity = String(i).padStart(3, '0');
                let IdSemiProduct = req.body.product_id
                mergeSemiProductLot = createYear + createMonth + createDay + IdSemiProduct + createQuantityProductSeries + createProductionSeries + incrementQuantity + createProductionStyle + createQuantity;
                const getSemiProduct = new SemiProduct({
                    jobsheet_code: mergeCodeJobsheet,
                    semi_product_lot: mergeSemiProductLot,
                    semi_product_code: req.body.product_id,
                    semi_product_name: req.body.product_name,
                    semi_product_unit: req.body.product_unit,
                    semi_product_status: '0',
                    semi_product_welding_status: '0',
                    semi_product_used: '0',
                    semi_product_qc_status: '0',
                });
                await getSemiProduct.save();
            }
        }
        else {
            res.json({
                status: 400,
                messege: 'Production Type not exits!!!',
            });
        }
        //------------------End Run Loop--------------------- ---------           
        const getJobSheet = new JobSheet(req.body);
        getJobSheet.jobsheet_code = mergeCodeJobsheet;
        getJobSheet.jobsheet_status = '0';
        let getData = await getJobSheet.save();
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

let edit = async (req, res) => {
    try {
        const token = req.headers.token; 
        let id = new ObjectId(req.params.id);
        let getproductOrderNo = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductOrder.find().select('product_order_No'));
        let getproductType = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductType.find());
        let getproductSeries = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductSeries.find());
        getId =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await JobSheet.aggregate
            ([
                {
                    $lookup: {
                        from: "product_types",
                        localField: "product_type_code",
                        foreignField: "product_type_code",
                        as: "dataProductType"
                    }
                },
                {
                    $lookup: {
                        from: "product_series",
                        localField: "product_series_code",
                        foreignField: "product_series_code",
                        as: "dataProductSeries"
                    }
                },
                {
                    $match: {
                        _id: id,
                    }
                }
            ]));
        if (getId) {
            return res.status(200).json({
                success: true, message: 'Infomation Field need to edit!!', data: getId, getproductOrderNo, getproductType, getproductSeries
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
        let OldJobsheetCode = req.body.jobsheet_code;
        checkId = await JobSheet.findOne({ _id: id });
        if (checkId == null) {
            res.json({
                status: 400,
                messege: 'This Id no exits!!!',

            });
        }        
        let getQuantity = req.body.product_quantity;
        if (getQuantity) {
            const getDateTime = new Date();
            const month = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
            //   Rule: 21A02     N    1     R     N     010
            //------------------------------------------------------------------------
            createQuantity = String(req.body.product_quantity).padStart(3, '0');  //get quantity
            createProductionStyle = req.body.production_style; //get type product (N or F)
            createProductionSeries = req.body.product_series_code; //get series product  
            createProductionType = req.body.product_type_code; //( Product or Semi-product);
            countProductSeries= await countSeriesinDay(req.body.product_series_code);          
            countProductSeries+=1   
            createQuantityProductSeries = countProductSeries; 
            //createQuantityProductSeries = '1'; 
            createDay = String(getDateTime.getDate()).padStart(2, '0');
            createMonth = month[getDateTime.getMonth()];
            createYear = getDateTime.getFullYear(); createYear = createYear.toString().substr(-2);
            mergeCodeJobsheet = createYear + createMonth + createDay + createProductionType + createQuantityProductSeries + createProductionSeries + createProductionStyle + createQuantity;
            //Rule Product: (R & P)  --Semi-product ( N & S)   
            if ((createProductionType == 'P') || (createProductionType == 'R')) {
                //check before delete                  
                let checkExits = await Product.findOne({ jobsheet_code: OldJobsheetCode }).count();
                if (checkExits > 0) {
                    await Product.deleteMany({ jobsheet_code: OldJobsheetCode });
                }  
                let checkExitsOther = await SemiProduct.findOne({ jobsheet_code: OldJobsheetCode }).count(); 
                if (checkExitsOther > 0) {
                    await SemiProduct.deleteMany({ jobsheet_code: OldJobsheetCode });
                }                   
                for (let i = 1; i <= getQuantity; i++) {
                    let incrementQuantity = String(i).padStart(3, '0');
                    mergeProductCode = createYear + createMonth + createDay + createProductionType + createQuantityProductSeries + createProductionSeries + incrementQuantity + createProductionStyle + createQuantity;
                    mergeProductSerial = createMonth + createDay + createYear + createProductionType + createQuantityProductSeries + createProductionSeries + incrementQuantity + createProductionStyle + createQuantity;
                    const getProduct = new Product({
                        jobsheet_code: mergeCodeJobsheet,
                        product_code: mergeProductCode,
                        product_serial: mergeProductSerial,
                        product_id: req.body.product_id,
                        product_name: req.body.product_name,
                        product_unit: req.body.product_unit,
                        product_status: '0',
                        product_assemble_status: '0',
                        product_qc_status: '0',
                    });

                    await getProduct.save();
                }
            }
            else if ((createProductionType == 'N') || (createProductionType == 'S')) {                                
                let checkExits = await SemiProduct.findOne({ jobsheet_code: OldJobsheetCode }).count();
                if (checkExits > 0) {
                    await SemiProduct.deleteMany({ jobsheet_code: OldJobsheetCode });
                }
                let checkExitsOther = await Product.findOne({ jobsheet_code: OldJobsheetCode }).count(); 
                if (checkExitsOther > 0) {
                    await Product.deleteMany({ jobsheet_code: OldJobsheetCode });
                } 
                for (let i = 1; i <= getQuantity; i++) {
                    let incrementQuantity = String(i).padStart(3, '0');
                    let IdSemiProduct = req.body.product_id
                    mergeSemiProductLot = createYear + createMonth + createDay + IdSemiProduct + createQuantityProductSeries + createProductionSeries + incrementQuantity + createProductionStyle + createQuantity;
                    const getSemiProduct = new SemiProduct({
                        jobsheet_code: mergeCodeJobsheet,
                        semi_product_lot: mergeSemiProductLot,
                        semi_product_code: req.body.product_id,
                        semi_product_name: req.body.product_name,
                        semi_product_unit: req.body.product_unit,
                        semi_product_status: '0',
                        semi_product_welding_status: '0',
                        semi_product_used: '0',
                        semi_product_qc_status: '0',
                    });
                    await getSemiProduct.save();
                }
            }
            else {
                res.json({
                    status: 400,
                    messege: 'Production Type not exits!!!',
                });
            }
        }
        req.body.jobsheet_code = mergeCodeJobsheet;
        getData = await JobSheet.findByIdAndUpdate(id, { $set: req.body });
        if (getData) {
            getNewData = await JobSheet.findOne({ _id: id });
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
let showDetail = async (req, res) => {
    const token = req.headers.token; 
    let getProductGroup =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await ProductGroup.find());
    let getDepartment =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await Department.find());
    getJobSheetCode = req.params.id;
    isCheckQuantityControl =await QualityControl.find({ jobsheet_code: getJobSheetCode }).count();
    _isCheckQuantityControl = isCheckQuantityControl > 0 ? 1 : 0;    
    isCheckWarehoue =await Warehouse.find({ jobsheet_code: getJobSheetCode }).count();    
    _isCheckWarehoue = isCheckWarehoue > 0 ? 1 : 0;
    const index = 6 - 1;
    if (index >= 0 && index < getJobSheetCode.length) {
        const createProductionType = getJobSheetCode.charAt(index);
        if ((createProductionType == 'P') || (createProductionType == 'R')) {
            // getshowDetail = await JobSheet.aggregate([
            //     {
            //         $lookup: {
            //             from: "products",
            //             localField: "jobsheet_code",
            //             foreignField: "jobsheet_code",
            //             pipeline:[                           
            //                 {
            //                     $lookup: {
            //                         from: "semi_products",
            //                         localField: "semi_product_lot",
            //                         foreignField: "semi_product_lot",
            //                         as: "SemiproductInfo",
            //                     },
            //                 }, 
            //             ],                       
            //             as: "dataProduct"
            //         }
            //     },              
            //     {
            //         $match: {
            //             jobsheet_code: getJobSheetCode
            //         }
            //     }
            // ])
           //
         
           //fix version Mongo
           getshowDetail =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await JobSheet.aggregate([
            {
                $match: {
                    jobsheet_code: getJobSheetCode
                }
            },
            {
                $lookup: {
                    from: "products",
                    let: { code: "$jobsheet_code" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$jobsheet_code", "$$code"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "semi_products",
                                localField: "semi_product_lot",
                                foreignField: "semi_product_lot",
                                as: "SemiproductInfo",
                            },
                        },
                    ],
                    as: "dataProduct"
                }
            }
        ]));
        
           return res.json({
                status:200,
                success: true, data: getshowDetail, getProductGroup, getDepartment, _isCheckQuantityControl,_isCheckWarehoue, message: 'Infomation field has been updated !!!'
            });

        }
        else if ((createProductionType == 'S') || (createProductionType == 'N')) {
            // getshowDetail = await JobSheet.aggregate([
            //     {
            //         $lookup: {
            //             from: "semi_products",
            //             localField: "jobsheet_code",
            //             foreignField: "jobsheet_code",
            //             pipeline:[
            //                 {
            //                     $addFields: {                                
            //                         categories_sim_id: { $toObjectId: "$categories_sim_id" }
            //                     },                                       
            //                 },
            //                 {
            //                     $lookup: {
            //                         from: "categories_sims",
            //                         localField: "categories_sim_id",
            //                         foreignField: "_id",
            //                         pipeline:[
            //                             {
            //                                 $addFields: {                                
            //                                     sim_package_id: { $toObjectId: "$sim_package_id" }
            //                                 },                                       
            //                             },
            //                             {
            //                                 $lookup: {
            //                                     from: "sim-packages",
            //                                     localField: "sim_package_id",
            //                                     foreignField: "_id",
            //                                     as: "SimpackageInfo",
            //                                 },
            //                             }, 
            //                         ],
            //                         as: "CategoriesSimInfo",
            //                     },
            //                 }, 
            //             ],
            //             as: "dataSemiProduct"
            //         }
            //     },
            //     {
            //         $match: {
            //             jobsheet_code: getJobSheetCode
            //         }
            //     }
            // ])
            getshowDetail =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await JobSheet.aggregate([
                {
                    $match: {
                        jobsheet_code: getJobSheetCode
                    }
                },
                {
                    $lookup: {
                        from: "semi_products",
                        let: { code: "$jobsheet_code" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$jobsheet_code", "$$code"] }
                                }
                            },
                            {
                                $addFields: {                                  
                                   categories_sim_id: {
                                    $cond: {
                                        if: { $eq: ["$categories_sim_id", ''] },
                                        then: '',
                                        else: { $toObjectId: "$categories_sim_id" }
                                    }
                                },    
                                }
                            },
                            {
                                $lookup: {
                                    from: "categories_sims",
                                    let: { catId: "$categories_sim_id" },
                                    pipeline: [
                                        {
                                            $match: {
                                                $expr: { $eq: ["$_id", "$$catId"] }
                                            }
                                        },
                                        {
                                            $addFields: {
                                                sim_package_id: { $toObjectId: "$sim_package_id" }
                                            }
                                        },
                                        {
                                            $lookup: {
                                                from: "sim-packages",
                                                localField: "sim_package_id",
                                                foreignField: "_id",
                                                as: "SimpackageInfo",
                                            },
                                        },
                                    ],
                                    as: "CategoriesSimInfo",
                                },
                            },
                        ],
                        as: "dataSemiProduct"
                    }
                }
            ]));
            
            return res.json({
                status:200,
                success: true, data: getshowDetail, getProductGroup, getDepartment, _isCheckQuantityControl,_isCheckWarehoue, message: 'Infomation field has been updated !!!'
            });
        }
    }
}
let cancel = async (req, res) => {
    try {
        id = req.params.id;
        checkId = await JobSheet.findOne({ _id: id });
        if (checkId == null) {
            res.json({ status: 400, messege: 'This Id no exits!!!' });
        }
        getProductionType = req.body.product_type_code;
        getJobSheetCode = req.body.oldjobsheetcode;
        updateJobSheet = new JobSheet({
            id: req.params.id,
            jobsheet_status: '3',
        })
        getData = await JobSheet.findByIdAndUpdate(id, { $set: updateJobSheet });
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            await Product.updateMany({ jobsheet_code: getJobSheetCode }, { product_status: '10' })

        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { semi_product_status: '10' })
        }
        if (getData) {
            getNewData = await JobSheet.findOne({ _id: id });
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
let OrderExportMaterials = async (req, res) => {
    try {
      console.log(req.body);
        getId = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            for (let i = 0; i < getId.length; i++) {
                await Product.findOneAndUpdate({ product_code: getId[i] }, { product_status: '1' })
            }

        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            for (let i = 0; i < getId.length; i++) {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getId[i] }, { semi_product_status: '1' });
            }
        }
        isCompleted = await JobSheet.findOneAndUpdate({ jobsheet_code: getJobSheetCode }, { jobsheet_status: '1' });
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
let ExportMaterials = async (req, res) => {
    try {
        console.log(req.body);
        getId = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {

            for (let i = 0; i < getId.length; i++) {
                await Product.findOneAndUpdate({ product_code: getId[i] }, { product_status: '2' })
            }
        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            for (let i = 0; i < getId.length; i++) {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getId[i] }, { semi_product_status: '2' });
            }
        }
        if (getInfo) {
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
let OrderProduct = async (req, res) => {
    try {
        getId = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            //create Assemble Collection(Product)
            isCheckJobsheetCode = await Assemble.findOne({ jobsheet_code: getJobSheetCode }).count();
            console.log('đếm được là', isCheckJobsheetCode);
            let today = new Date();
            dd = String(today.getDate()).padStart(2, '0');
            mm = String(today.getMonth() + 1).padStart(2, '0');
            yyyy = today.getFullYear();
            createDay = mm + '/' + dd + '/' + yyyy;
            for (let i = 0; i < getId.length; i++) {
                await Product.findOneAndUpdate({ product_code: getId[i] }, { $set: { product_status: '3', product_assemble_status: '1' } });
            }
            isCheckJobsheetCode = await Assemble.find({ jobsheet_code: getJobSheetCode }).count();
            if (isCheckJobsheetCode === 0) {
                getAssemble = new Assemble({
                    jobsheet_code: getJobSheetCode,
                    assemble_create_date: createDay,
                    assemble_status: '0'
                });
                getData = await getAssemble.save();
            }
        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            //create Welding Collection (Semi-Product)
            let today = new Date();
            dd = String(today.getDate()).padStart(2, '0');
            mm = String(today.getMonth() + 1).padStart(2, '0');
            yyyy = today.getFullYear();
            createDay = mm + '/' + dd + '/' + yyyy;
            for (let i = 0; i < getId.length; i++) {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getId[i] }, { $set: { semi_product_status: '3', semi_product_welding_status: '1' } });
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
            }
        }
        if (getInfo) {
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
let infoCreatOrderQC = async (req, res) => {
    const token = req.headers.token; 
    getProductCode = req.params.id;
    getProductGroup =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProductGroup.find());
    if (getProductGroup) {
        return res.json({
            status:200,
            success: true, message: 'Get Data Completed !!!', getProductGroup
        });
    }
}
let OrderQC = async (req, res) => {
    try {
        // Example Generate ............//
        console.log(req.body);
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
        const month = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
        createDay = String(getDateTime.getDate()).padStart(2, '0');
        createMonth = month[getDateTime.getMonth()];
        createYear = getDateTime.getFullYear(); createYear = createYear.toString().substr(-2);
        createTypeQualityControl = req.body.type_quality_control   //Type check (T or R)
        createTypeProducttoCheck = req.body.type_product_to_check  //Type product need to check ( M/S/P)
        createTypeProductGroup = req.body.type_product_group//Code Group Product
        createDepartment = req.body.department
        getCount = await QualityControl.find({ created: { $gte: start, $lt: end } }).count();
        getCount += 1;
        createQuantity = String(getCount).padStart(3, '0');  
        console.log('đếm được là:', createQuantity);
        mergeCodeQualityControl = 'QC' + createYear + createMonth + createDay + createTypeQualityControl + createTypeProducttoCheck + createTypeProductGroup + createDepartment + createQuantity;
        console.log(mergeCodeQualityControl);
        //Data get form body.../
        isCheckStatus = true;
        getQCArray = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        getUSer = req.body.fullname;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            //Loop here..........//
            for (let i = 0; i < getQCArray.length; i++) {
                console.log(i);
                isCheckQuantityControl = await QualityControl.find({ jobsheet_code: getJobSheetCode }).count();
                console.log('kiem tra ton tai thành phẩm', isCheckQuantityControl)
                if (isCheckQuantityControl === 0) {
                    getQualityControl = new QualityControl({
                        quality_control_code: mergeCodeQualityControl,
                        jobsheet_code: getJobSheetCode,
                        quality_control_create_date: CurrentDay,
                        user_id: getUSer,
                    });
                    getData = await getQualityControl.save();
                }


                isCompleted = await Product.updateOne({ product_code: getQCArray[i] }, { $set: { product_status: '6', product_qc_status: '1' } });
                isCheckStatus = isCompleted ? true : false;
            }            
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
            for (let i = 0; i < getQCArray.length; i++) {
                isCheckQuantityControl = await QualityControl.find({ jobsheet_code: getJobSheetCode }).count();
                console.log('kiem tra ton tai bán thành phẩm', isCheckQuantityControl)
                if (isCheckQuantityControl === 0) {
                    console.log('code thôi!');
                    getQualityControl = new QualityControl({
                        quality_control_code: mergeCodeQualityControl,
                        jobsheet_code: getJobSheetCode,
                        quality_control_create_date: CurrentDay,
                        user_id: getUSer,
                    });
                    getData = await getQualityControl.save();
                }
                isCompleted = await SemiProduct.updateOne({ semi_product_lot: getQCArray[i] }, { $set: { semi_product_status: '6', semi_product_qc_status: '1' } });
                isCheckStatus = isCompleted ? true : false;            }           
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
let OrderStore = async (req, res) => {
    try {
        getJobSheetCode = req.body.jobsheetCode;
        console.log(req.body);
        getOrderStoreArray = req.body.arrayProductID;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            for (let i = 0; i < getOrderStoreArray.length; i++) {
                isCompleted = await Product.findOneAndUpdate({ product_code: getOrderStoreArray[i] }, { product_status: '8' });
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
            for (let i = 0; i < getOrderStoreArray.length; i++) {
                isCompleted = await SemiProduct.findOneAndUpdate({ semi_product_lot: getOrderStoreArray[i] }, { semi_product_status: '8' });
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
let Store = async (req, res) => {
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
        getOrderStoreArray = req.body.arrayProductID;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            for (let i = 0; i < getOrderStoreArray.length; i++) {
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
                     
                }
                
                isCompleted = await Product.findOneAndUpdate({ product_code: getOrderStoreArray[i] }, { product_status: '9'});
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
            for (let i = 0; i < getOrderStoreArray.length; i++) {
                isCheckWarehoue = await Warehouse.find({ jobsheet_code: getJobSheetCode }).count();
               // console.log('kiem tra ton tai bán thành phẩm', isCheckWarehoue);
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
                isCompleted = await SemiProduct.findOneAndUpdate({ semi_product_lot: getOrderStoreArray[i] }, { semi_product_status: '9' });
            }
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

let countSeriesinDay=async(data)=>
{
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    return await JobSheet.find({created: { $gte: start, $lt: end }, product_series_code:data}).count()      
}
module.exports = {
    index: index,
    store: store,
    infotoCreate: infotoCreate,
    edit: edit,
    update: update,
    cancel: cancel,
    showDetail: showDetail,
    OrderExportMaterials: OrderExportMaterials,
    ExportMaterials: ExportMaterials,
    OrderProduct: OrderProduct,
    infoCreatOrderQC: infoCreatOrderQC,    
    OrderQC: OrderQC,
    OrderStore: OrderStore,
    Store: Store,   
    countSeriesinDay:countSeriesinDay,
}