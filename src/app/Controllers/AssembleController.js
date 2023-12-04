const Assemble = require('../models/assemble');
const JobSheet = require('../models/jobsheet');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const CategoriesSim = require('../models/categories_sim');
const SimPackage = require('../models/sim_packages');
const cryptJSon = require('../../helper/cryptJSon');
let AssembleList = async (req, res) => {
    try {        
        const token = req.headers.token; 
        getData =await cryptJSon.encryptData(token, await Assemble.aggregate([
            {
                $lookup: {
                    from: "jobsheets",
                    localField: "jobsheet_code",
                    foreignField: "jobsheet_code",
                    as: "getDetail"
                }
            }]));     
        if (getData) {
            return res.json({
                status:200,
                success: true,
                data: getData,
                message: 'Get Data Completed!!!'
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
let showDetailAssemble = async (req, res) => {
    try {   
        const token = req.headers.token;     
        getJobSheetCode = req.params.id;        
        getProductLot =await cryptJSon.encryptData(token, await SemiProduct.aggregate([
            {
                $addFields: {
                    categories_sim_id: {
                        $toObjectId: "$categories_sim_id"
                    },
                    sim_package_id: {
                        $toObjectId: "$sim_package_id"
                    }
                }
            },
            {
                $lookup: {
                    from: "categories_sims",
                    localField: "categories_sim_id",
                    foreignField: "_id",
                    as: "CategoriesInfo"
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
            {
                $match: {
                    $and: [
                        {
                            semi_product_used: "0"
                        },
                        {
                            semi_product_status: "9"
                        }
                    ]
                }
            },
        ]));      
    
        //code fix version MongoDB    
        getData =await cryptJSon.encryptData(token, await JobSheet.aggregate([
            {
                $lookup: {
                    from: "products",
                    let: { job_code: "$jobsheet_code" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$job_code", "$jobsheet_code"] },
                                        { $eq: ["$product_assemble_status", "1"] }
                                    ]
                                }
                               // $expr: { $eq: ["$$job_code", "$jobsheet_code"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "semi_products",
                                let: { semi_lot: "$semi_product_lot" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {   $eq: ["$$semi_lot", "$semi_product_lot"] },
                                            
                                        }
                                    },
                                    {
                                        $addFields: {
                                            categories_sim_id: { $toObjectId: "$categories_sim_id" },
                                            sim_package_id: { $toObjectId: "$sim_package_id" }
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "categories_sims",
                                            localField: "categories_sim_id",
                                            foreignField: "_id",
                                            as: "categoriesSimData",
                                        },
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
                                as: "semiProductData",
                            },
                        },
                    ],
                    as: "getDetail",
                },
            },
            {
                $match: { jobsheet_code: getJobSheetCode },
            },
        ]));    
     
               
        if (getData) {
            return res.json({
                status:200,
                success: true,
                data: getData, getProductLot,
                message: 'Get Data Completed!!!'
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
let approveAssembleOrder = async (req, res) => {
    try {
        getUser = req.body.fullname;
        getProductCode = req.params.id;
        console.log(getProductCode);
        isCheck = await Product.updateOne({ product_code: getProductCode }, {
            $set: {
                product_assembler: getUser, product_status: '4'
            }
        });
        getJobSheetCode = await Product.findOne({ product_code: getProductCode });       
        await Assemble.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { assemble_status: 'Đang lắp ráp' });
        if (isCheck) {
            return res.json({
                status:200,
                success: true,               
                message: 'Get Data Completed!!!'
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
let infotoUpdate = async (req, res) => {
    try {
        getProductCode = req.params.id;           
        getIdLotSemiProduct = await SemiProduct.find({ $or: [{ semi_product_status: "Hoàn Thành" }, { semi_product_status: "Đã nhập kho" }] });
        joinSemiProductWithSim = await SemiProduct.aggregate([
            {
                $lookup: {
                    from: "categories_sims",
                    localField: "semi_product_lot",
                    foreignField: "semi_product_id",
                    as: "getDetail"
                }
            },
            {
                $match: { semi_product_lot: getIdLotSemiProduct.semi_product_lot }
            }
        ]);
        console.log(getIdLotSemiProduct);
        getData = await Product.aggregate([
            {
                $lookup: {
                    from: "jobsheets",
                    localField: "jobsheet_code",
                    foreignField: "jobsheet_code",
                    as: "getDetail"
                }
            },
            {
                $match: { product_code: getProductCode }
            }
        ])
        if (getData) {
            return res.json({
                status:200,
                success: true,
                data: getData, getIdLotSemiProduct, joinSemiProductWithSim,
                message: 'Get Data Completed!!!'
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
let updateAssembleOrder = async (req, res) => {
    try {
        console.log(req.body);
        console.log('giá trị params',req.params.id);
        getProductCode = req.params.id;
        getOldSemiProductLot = req.body.old_semi_product_lot;
        getSemiProductLot = req.body.semi_product_lot;
        getStatus=req.body.product_status;       
         
        if(getStatus==='5')
        {             
            if(getSemiProductLot)
            {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { semi_product_used: '1' });
            }      
       getData = await Product.findOneAndUpdate({ product_code: getProductCode }, { $set: { product_status:getStatus, semi_product_lot: req.body.semi_product_lot,product_assembler:req.body.product_assembler,product_assembly_date:req.body.product_assembly_date } });
                if (getData) {
            return res.json({
                status:200,
                success: true,
                message: 'Get Data Completed!!!'
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
          else if(getStatus==='10')
          {           
            if(getOldSemiProductLot)            {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getOldSemiProductLot }, { semi_product_used: '0' }); 
            }         
        
             getData = await Product.findOneAndUpdate({ product_code: getProductCode },{$set: { product_status:getStatus,semi_product_lot:'',product_assembler:'',product_assembly_date:''}});
            if (getData) {
                return res.json({
                    status:200,
                    success: true,
                    message: 'Get Data Completed!!!'
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
            // if (getOldSemiProductLot) {
        //     console.log('1')
        //     await SemiProduct.findOneAndUpdate({ semi_product_lot: getOldSemiProductLot }, { semi_product_used: '0' });
        //     getData = await Product.findOneAndUpdate({ product_code: getOldSemiProductLot }, {  product_status: '10' });
        // }
        // if(getSemiProductLot)
        // {
        //     console.log('nhận được getSemi')

        //     await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { semi_product_used: '1' });
        // }
      
      
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
    AssembleList: AssembleList,
    showDetailAssemble: showDetailAssemble,
    approveAssembleOrder: approveAssembleOrder,
    infotoUpdate: infotoUpdate,
    updateAssembleOrder: updateAssembleOrder,
}