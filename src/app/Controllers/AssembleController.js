const Assemble = require('../models/assemble');
const JobSheet = require('../models/jobsheet');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const CategoriesSim = require('../models/categories_sim');
const SimPackage = require('../models/sim_packages');
let AssembleList = async (req, res) => {
    try {
      //  getData = await Assemble.find();
      getData=await Assemble.aggregate([
        {

            $lookup: {
                from: "jobsheets",              
                localField: "jobsheet_code",
                foreignField: "jobsheet_code",
                as: "getDetail" 
            }
        }]);
    //   getDataCon = await Assemble.aggregate([
           
    //   ])
     
        if (getData) {
            return res.status(200).json({
                success: true,
                data: getData,
                message: 'Get Data Completed!!!'
            });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let showDetailAssemble = async (req, res) => {
    try {
       // getCategoriesSim=await CategoriesSim.find({use_sim:'0'});
      //  getSimPackage=await SimPackage.find();
        getJobSheetCode = req.params.id;
        //code lấy danh sách select semiproductLot
        getProductLot=await SemiProduct.aggregate([
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
        ])//get Join 
        // getData = await JobSheet.aggregate([
        //     {
        //         $lookup: {
        //             from: "products",
        //             localField: "jobsheet_code",
        //             foreignField: "jobsheet_code",
        //             as: "getDetail"
        //         }
        //     },
        //     {
        //         $match: { jobsheet_code: getJobSheetCode }
        //     }
        // ])
        getData = await JobSheet.aggregate([  
            {
                $lookup: {
                    from: "products",     
                     pipeline: [
                         {
                            $match: {
                                product_assemble_status: "1",
                            },
                        },                  
                       
                    ],            
                    localField: "jobsheet_code",
                    foreignField: "jobsheet_code",
                    as: "getDetail",
                },
            },
            {
                $match: { jobsheet_code:getJobSheetCode },
            },                  
        ]);
        if (getData) {
            return res.status(200).json({
                success: true,
                data: getData,getProductLot,
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
      //  await JobSheet.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { jobsheet_status: 'Đang lắp ráp' });
        await Assemble.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { assemble_status: 'Đang lắp ráp' });
        if (isCheck) {

            return res.status(200).json({
                success: true,
                // data: getData,
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
let infotoUpdate = async (req, res) => {
    try {
        getProductCode = req.params.id;
       
        // getCategoriesSimNoneUse = await CategoriesSim.find({ use_sim: '0' });  //get sim none used
        // getSimPackage = await SimPackage.find();      
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

            return res.status(200).json({
                success: true,
                data: getData, getIdLotSemiProduct, joinSemiProductWithSim,
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
let updateAssembleOrder = async (req, res) => {
    try {
       console.log(req.params.id);
        getProductCode = req.params.id;
        req.body.product_status='5';   
        getSemiProductLot=req.body.semi_product_lot;           
        getData = await Product.findOneAndUpdate({ product_code: getProductCode }, { $set:req.body});
        await SemiProduct.findOneAndUpdate({semi_product_lot:getSemiProductLot},{semi_product_used:'1'});
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
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
module.exports = {
    AssembleList: AssembleList,
    showDetailAssemble: showDetailAssemble,
    approveAssembleOrder: approveAssembleOrder,
    infotoUpdate: infotoUpdate,
    updateAssembleOrder: updateAssembleOrder,
}