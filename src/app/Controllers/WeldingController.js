const Welding = require('../models/welding');
const JobSheet = require('../models/jobsheet');
const SemiProduct = require('../models/semi_product');
const CategoriesSim = require('../models/categories_sim');
const SimPackage = require('../models/sim_packages');
const QualityControl = require('../models/quality_control');
const { ObjectId } = require('mongodb');
let WeldingList = async (req, res) => {
    try {       
        getCategoriesSim=await CategoriesSim.find({use_sim:'0'});
        getSimPackage=await SimPackage.find();
        getJobSheetCode = req.params.id;
        let getSim = await SemiProduct.aggregate([
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
            pipeline: [
                {
                    $match: {
                        semi_product_welding_status: "1",
                    },
                },
                {
                    $lookup: {
                        from: "categories_sims",
                        localField: "categories_sim_id",  // Trường ở SemiProductSchema
                        foreignField: "_id", // Trường ở CategoriesSimSchema
                        as: "categoryInfo",
                    },
                },
            ],
            localField: "jobsheet_code",
            foreignField: "jobsheet_code",
            as: "getDetail",
        },
    },
    {
        $match: { jobsheet_code: getJobSheetCode },
    },             
        ]);
        console.log(getSim);
        getData=await Welding.aggregate([
            {
                $lookup: {
                    from: "jobsheets",
                    localField: "jobsheet_code",
                    foreignField: "jobsheet_code",
                    as: "getDetail" 
                }
            }
          ])
        if (getData) {
            return res.status(200).json({
                success: true,
                data: getData,getCategoriesSim,getSimPackage,getSim,
                message: 'Get Data Completed!!!'
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let showDetailWelding = async (req, res) => {
    try {
        getJobSheetCode = req.params.id;
        getCategoriesSim=await CategoriesSim.find({use_sim:'0'});
        getSimPackage=await SimPackage.find();
        getData = await JobSheet.aggregate([  
                        
       {
        $lookup: {
            from: "semi_products",
            pipeline: [
                {
                    $match: {
                        semi_product_welding_status: "1",
                    },
                },
                // {
                //     $addFields: {
                //         categories_sim_id: {
                //           //  $toObjectId: "$categories_sim_id",       
                //           $cond: {
                //             if: { $eq: ["$categories_sim_id", ''] },
                //             then: null, // or any other default value you prefer
                //             else: { $toObjectId: "$categories_sim_id" }
                //           }                    
                //         }
                //     }
                // },
               
                {
                    $addFields: {
                        sim_package_id: {
                            $toObjectId: "$sim_package_id"
                        }
                    }
                },
                {
                    $addFields: {
                      categories_sim_id: {
                        $cond: {
                          if: {
                            $or: [
                              { $eq: ["$categories_sim_id", null] },
                              { $eq: ["$categories_sim_id", ""] }
                            ]
                          },
                          then: null,
                          else: { $toObjectId: "$categories_sim_id" }
                        }
                      }
                    }
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
            localField: "jobsheet_code",
            foreignField: "jobsheet_code",
            as: "getDetail",
        },
    },
    {
        $match: { jobsheet_code: getJobSheetCode },
    },             
        ]);
        getSemiProduct_Sim=await SemiProduct.aggregate([
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
        ]);
        if (getData) {
            return res.status(200).json({
                success: true,
                data: getData,getCategoriesSim,getSimPackage,getSemiProduct_Sim,
                message: 'Get Data Completed!!!'
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let approveWeldingOrder = async (req, res) => {
    try {
        console.log(req.body);
        getUser = req.body.fullname;
        getSemiProductLot = req.params.id;
        isCheck = await SemiProduct.updateOne({ semi_product_lot: getSemiProductLot }, {
            $set: {
                semi_product_assembler: getUser, semi_product_status: '4'
            }
        });
        //update Jobsheet/Welding
        getJobSheetCode = await SemiProduct.findOne({ semi_product_lot: getSemiProductLot });
       // await JobSheet.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { jobsheet_status: 'Đang hàn mạch' });
        await Welding.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { welding_status: 'Đang hàn mạch' })
        if (isCheck) {

            return res.status(200).json({
                success: true,
                data: getData,
                message: 'Get Data Completed!!!'
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }


}
// let infotoUpdate = async (req, res) => {
//     try {
//         getSemiProductLot = req.params.id;
//         getCategoriesSimNoneUse = await CategoriesSim.find({ use_sim: '0' });  //get sim none used
//         getSimPackage = await SimPackage.find();
//         getData = await SemiProduct.aggregate([
//             {
//                 $lookup: {
//                     from: "jobsheets",
//                     localField: "jobsheet_code",
//                     foreignField: "jobsheet_code",
//                     as: "getDetail"
//                 }
//             },
//             {
//                 $match: { semi_product_lot: getSemiProductLot }
//             }

//         ])
//         if (getData) {

//             return res.status(200).json({
//                 success: true,
//                 data: getData, getCategoriesSimNoneUse, getSimPackage,
//                 message: 'Get Data Completed!!!'
//             });
//         }
//         else {
//             throw new Error('Error connecting Database on Server');
//         }
//     }
//     catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, error: err.message });
//     }

// }
let updateWeldingOrder = async (req, res) => {
    try {
        console.log('giá trị chuẩn bị cập nhật',req.body);
        req.body.semi_product_used='1';
        getSemiProductLot = req.params.id;        
       // getOldSim = new ObjectId(req.body.old_sim);
       getOldSim = req.body.old_sim;
       console.log('giá trị Oldsim',getOldSim);
       
        getNewSim = req.body.categories_sim_id;
       // getSemiProduct = new SemiProduct(req.body);
       // getSemiProduct.semi_product_status='5';
       isCheckStatus=req.body.semi_product_status;
       console.log(isCheckStatus);
       if((isCheckStatus==='10')&&(getOldSim))
       {
        getCategoriesSim = new CategoriesSim({
            _id: getOldSim,
            activation_date: '',
            purpose: '',
            sim_package_id: '',
            expiration_date: '',
            semi_product_id: '',
            manage_sim_note: '',
        })
        await CategoriesSim.findByIdAndUpdate(getOldSim, { use_sim: '0', $set: getCategoriesSim });
        // clearInfoSemiProduct=new SemiProduct({
        //       semi_categories_sim_id:'',
        //       semi_product_assembler:'',
        //       semi_product_assembly_date:'',
        // })   
        await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, {$set:{categories_sim_id:'',semi_product_assembly_date:''}});
                
       }
       else
       {
        getData = await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { $set:req.body});// (req.body);
        InfoSemiProduct = await SemiProduct.findOne({ semi_product_lot: getSemiProductLot }); //lấy id semi-product thông qua id lot
        console.log(InfoSemiProduct);
        const getId = new ObjectId(InfoSemiProduct.categories_sim_id);
        console.log(InfoSemiProduct);
        //clear Old Sim
        if (getNewSim) {
            getCategoriesSim = new CategoriesSim({
                _id: getId,
                activation_date: req.body.activation_date,
                purpose: req.body.purpose,
                sim_package_id: req.body.sim_package_id,
                expiration_date: req.body.expiration_date,
                semi_product_id: InfoSemiProduct._id,
                manage_sim_note: req.body.semi_product_note,
            })
            await CategoriesSim.findByIdAndUpdate(getId, { use_sim: '1', $set: getCategoriesSim });
        }
        if (getOldSim) {
            getCategoriesSim = new CategoriesSim({
                _id: getOldSim,
                activation_date: '',
                purpose: '',
                sim_package_id: '',
                expiration_date: '',
                semi_product_id: '',
                manage_sim_note: '',
            })
            await CategoriesSim.findByIdAndUpdate(getOldSim, { use_sim: '0', $set: getCategoriesSim });
        }
       
        await QualityControl.findOneAndUpdate({jobsheet_code:InfoSemiProduct.jobsheet_code},{quality_control_status:'Đang hàn mạch'});
        if (getData) {
            return res.status(200).json({
                success: true,
                message: 'Get Data Completed!!!'
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
        
    }
}
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let checkWelding = async (req, res) => {

}
module.exports = {
    WeldingList: WeldingList,
    showDetailWelding: showDetailWelding,
    approveWeldingOrder: approveWeldingOrder,   
    updateWeldingOrder: updateWeldingOrder,
    checkWelding: checkWelding,
}