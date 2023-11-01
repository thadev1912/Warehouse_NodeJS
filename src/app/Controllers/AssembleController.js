const Assemble = require('../models/assemble');
const JobSheet = require('../models/jobsheet');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const CategoriesSim = require('../models/categories_sim');
let AssembleList = async (req, res) => {
    try {
        getData = await Assemble.find();
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
        getJobSheetCode = req.params.id;
        getData = await JobSheet.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "jobsheet_code",
                    foreignField: "jobsheet_code",
                    as: "getDetail"
                }
            },
            {
                $match: { jobsheet_code: getJobSheetCode }
            }
        ])
        if (getData) {
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
let approveAssembleOrder = async (req, res) => {
    try {
        getUser = req.body.username;
        getProductCode = req.params.id;
        console.log(getProductCode);
        isCheck = await Product.updateOne({ product_code: getProductCode }, {
            $set: {
                product_assembler: getUser, product_status: 'Đang lắp ráp'
            }
        });
        getJobSheetCode = await Product.findOne({ product_code: getProductCode });
        await JobSheet.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { jobsheet_status: 'Đang lắp ráp' });
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
        getProductCode = req.params.id;        
        getData = await Product.findOneAndUpdate({ product_code: getProductCode }, { $set: req.body });
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