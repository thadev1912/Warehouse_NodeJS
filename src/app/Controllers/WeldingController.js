const Welding = require('../models/welding');
const JobSheet = require('../models/jobsheet');
const SemiProduct = require('../models/semi_product');
const CategoriesSim = require('../models/categories_sim');
const SimPackage = require('../models/sim_packages');
const QualityControl = require('../models/quality_control');
const { ObjectId } = require('mongodb');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const updateSim = require('../../helper/updateSim');
const setLogger = require('../../helper/setLogger');
let WeldingList = async (req, res) => {
    try {
        const token = req.headers.token;
        getCategoriesSim = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await CategoriesSim.find({ use_sim: '0' }));
        getSimPackage = await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await SimPackage.find());
        getJobSheetCode = req.params.id;      
       //fix version mongoDB
       let getSim =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await SemiProduct.aggregate([
        {
            $addFields: {
                categories_sim_id: {
                    $toObjectId: "$categories_sim_id"
                }
            }
        },
        {
            $lookup: {
                from: "semi_products", 
                let:{job_code:"$jobsheet_code"},                   
                pipeline: [
                    {
                        $match: {
                            expr:{
                                and:[
                             { $eq:["$$job_code", "$jobsheet_code"] } ,
                              { $eq:["$semi_product_welding_status", "1"] } ,

                                ]
                            }
                           
                        },
                    },
                    {
                        $lookup: {
                            from: "categories_sims",
                            localField: "categories_sim_id",  
                            foreignField: "_id", 
                            as: "categoryInfo",
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
        getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await Welding.aggregate([
            {
                $lookup: {
                    from: "jobsheets",
                    localField: "jobsheet_code",
                    foreignField: "jobsheet_code",
                    as: "getDetail"
                }
            },
            {
                $sort: {
                    created: -1 
                }
            },
        ]));
        if (getData) {
            return res.json({
                status:200,
                success: true,
                data: getData, getCategoriesSim, getSimPackage, getSim,
                message: 'Get Data Completed!!!'
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
let WeldingListById=async(req,res)=>
{
   try
   {
    const token = req.headers.token; 
    getJobSheetCode = req.params.id;      
    getData ==await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await Welding.aggregate([
        {
            $lookup: {
                from: "jobsheets",
                localField: "jobsheet_code",
                foreignField: "jobsheet_code",
                as: "getDetail"
            }
        },
        {
            $match:{ jobsheet_code:getJobSheetCode}
        }
    ]));
    if (getData) {
        return res.json({
            status:200,
            success: true,
            data: getData,
            message: 'Get Data Completed!!!'
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
   catch
   {

   }
}
let showDetailWelding = async (req, res) => {
    try {
        const token = req.headers.token;
        getJobSheetCode = req.params.id;
        getCategoriesSim =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await CategoriesSim.find({ use_sim: '0' }));
        getSimPackage =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await SimPackage.find());     
        // getData = await JobSheet.aggregate([
        //     {
        //         $lookup: {
        //             from: "semi_products",
        //             pipeline: [
        //                 {
        //                     $match: {
        //                         semi_product_welding_status: "1",
        //                     },
        //                 },
        //                 { $unwind: { path: '$categories_sim_id', preserveNullAndEmptyArrays: true } },
        //                 {
        //                     $addFields: {
        //                         categories_sim_id: {
        //                             $cond: {
        //                                 if: { $eq: ["$categories_sim_id", ''] },
        //                                 then: '',
        //                                 else: { $toObjectId: "$categories_sim_id" }
        //                             }
        //                         },
        //                         sim_package_id: {
        //                             $toObjectId: "$sim_package_id"
        //                         },
        //                     },
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "categories_sims",
        //                         localField: "categories_sim_id",
        //                         foreignField: "_id",
        //                         as: "categoryInfo",
        //                     },
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "sim-packages",
        //                         localField: "sim_package_id",
        //                         foreignField: "_id",
        //                         as: "SimpackageInfo",
        //                     },
        //                 },


        //             ],
        //             localField: "jobsheet_code",
        //             foreignField: "jobsheet_code",
        //             as: "getDetail",
        //         },
        //     },
        //     {
        //         $match: { jobsheet_code: getJobSheetCode },
        //     },
        // ]);
        //fix version mongoDB
        getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await JobSheet.aggregate([
            {
                $lookup: {
                    from: "semi_products",
                    let: { job_code: "$jobsheet_code" },
                    pipeline: [
                        {
                            $addFields: {                  
                              //  semi_product_assembler: {$toObjectId: "$semi_product_assembler"},  
                              semi_product_assembler: {
                                $cond: {
                                    if: { $eq: ["$semi_product_assembler", ''] },
                                    then: '',
                                    else: { $toObjectId: "$semi_product_assembler" }
                                }
                            },          
                                semi_product_tester: {$toObjectId: "$semi_product_tester"},                            
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { semi_product_assembler: "$semi_product_assembler" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$semi_product_assembler"] }
                                        }
                                    },
                                    {
                                        $project: { _id: 1, fullname: 1 }
                                    }
                                  
                                ],
                                as: "getIdAssembler"
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                let: { semi_product_tester: "$semi_product_tester" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$semi_product_tester"] }
                                        }
                                    },
                                    {
                                        $project: { _id: 1, fullname: 1 }
                                    }
                                  
                                ],
                                as: "getIdTester"
                            }
                        },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$$job_code", "$jobsheet_code"] },
                                        { $eq: ["$semi_product_welding_status", "1"] }
                                    ]
                                }
                            }
                        },
                        {
                            $addFields: {
                                categories_sim_id: {
                                    $cond: {
                                        if: { $eq: ["$categories_sim_id", ""] },
                                        then: "",
                                        else: { $toObjectId: "$categories_sim_id" }
                                    }
                                },
                                sim_package_id: { $toObjectId: "$sim_package_id" },
                            },
                        },
                        {
                            $lookup: {
                                from: "categories_sims",
                                localField: "categories_sim_id",
                                foreignField: "_id",
                                as: "categoryInfo",
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
                    as: "getDetail",
                },
            },
            {
                $match: { jobsheet_code: getJobSheetCode },
            },
        ]));                
        getSemiProduct_Sim =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await SemiProduct.aggregate([
            {
                $addFields: {
                    categories_sim_id: {
                        $toObjectId: "$categories_sim_id"
                    }
                }
            },
            {
                $lookup: {
                    from: "categories_sims",
                    localField: "categories_sim_id",
                    foreignField: "_id",
                    as: "getDetail"
                }
            },

            {
                $match: { semi_product_lot: getJobSheetCode }
            },
        ]));
        if (getData) {
            return res.json({
                status:200,
                success: true,
                data: getData, getCategoriesSim, getSimPackage, getSemiProduct_Sim,
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
let approveWeldingOrder = async (req, res) => {
    try {
        const token = req.headers.token; 
        getUser = req.body.fullname;
        getSemiProductLot = req.params.id;
        isCheck = await SemiProduct.updateOne({ semi_product_lot: getSemiProductLot }, {
            $set: {
                semi_product_assembler: getUser, semi_product_status: '4'
            }
        });       
        getJobSheetCode = await SemiProduct.findOne({ semi_product_lot: getSemiProductLot });       
        await Welding.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { welding_status: 'Đang hàn mạch' })
        if (isCheck) {
            setLogger.logAprrove(getInfoUser,req);
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
let updateWeldingOrder = async (req, res) => {
    try {   
        console.log(req.body);          
        getSemiProductLot = req.params.id;
        getOldSim = req.body.old_sim;
        getNewSim = req.body.categories_sim_id;
        isCheckStatus = req.body.semi_product_status;    
        getData = await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { $set: req.body });
        InfoSemiProduct = await SemiProduct.findOne({ semi_product_lot: getSemiProductLot }); 
        if ((isCheckStatus === '10')&& getOldSim){        
                getCancelCategoriesSim = new CategoriesSim({
                _id: getOldSim,
                activation_date: '',
                purpose: '',
                sim_package_id: '',
                expiration_date: '',
                semi_product_id: '',
                manage_sim_note: '',
            });          
            await CategoriesSim.findByIdAndUpdate(getOldSim, { use_sim: '0', $set: getCancelCategoriesSim }); 
            await updateSim.updateStatusSim();  
            await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { $set:{semi_product_status:'10',semi_product_assembler:'',categories_sim_id:'',semi_product_assembly_date:''} });      
            isExits=await SemiProduct.findOne({ semi_product_lot: getSemiProductLot}).count();
            if(isExits>0)
            {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, {$set:{categories_sim_id:'',semi_product_assembly_date:''}});
            }
               }    
        
        if(getOldSim)
        {
            infoOldSim = await CategoriesSim.findOne({ _id: getOldSim });         
            const OldId= infoOldSim._id;            
            getClearCategoriesSim = new CategoriesSim({
                _id: OldId,
                activation_date: '',
                purpose: '',
                sim_package_id: '',
                expiration_date: '',
                semi_product_id: '',
                manage_sim_note: '',
            })
            await CategoriesSim.findByIdAndUpdate(OldId, { use_sim: '0', $set: getClearCategoriesSim });      
            await updateSim.updateStatusSim();     
        }            
        if (getNewSim) {
            const getId = new ObjectId(InfoSemiProduct.categories_sim_id);  
            getUpdateCategoriesSim = new CategoriesSim({    
                _id: getId,                
                activation_date: req.body.activation_date,
                purpose: req.body.purpose,
                sim_package_id: req.body.sim_package_id,
                expiration_date: req.body.expiration_date,
                semi_product_id: InfoSemiProduct._id,
                manage_sim_note: req.body.semi_product_note,

            });
            await CategoriesSim.findByIdAndUpdate(getId, { use_sim: '1', $set: getUpdateCategoriesSim }); 
            await updateSim.updateStatusSim();               
        }
        await QualityControl.findOneAndUpdate({ jobsheet_code: InfoSemiProduct.jobsheet_code }, { quality_control_status: 'Đang hàn mạch' });
        if (getData) {
            setLogger.logUpdate(getInfoUser,req);
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

let checkWelding = async (req, res) => {
}
module.exports = {
    WeldingList: WeldingList,
    WeldingListById:WeldingListById,
    showDetailWelding: showDetailWelding,
    approveWeldingOrder: approveWeldingOrder,
    updateWeldingOrder: updateWeldingOrder,
    checkWelding: checkWelding,
}