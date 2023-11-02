const QualityControl = require('../models/quality_control');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const JobSheet = require('../models/jobsheet');

let index = async (req, res) => {
    try {
        let getData = await QualityControl.aggregate([
            {
                $lookup: {
                    from: "jobsheets",
                    localField: "jobsheet_code",
                    foreignField: "jobsheet_code",
                    as: "getDetail"
                },
            }
        ]);
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
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
let detailProduct = async (req, res) => {
    getProduct = await Product.aggregate([
        {


            $lookup: {
                from: "jobsheets",
                localField: "jobsheet_code",
                foreignField: "jobsheet_code",
                as: "getDetail"
            },
        },
        {
            $match: { product_status: 'Đã gửi YCKT' }
        }

    ]);
    if (getProduct) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
            data: getProduct,
        });
    }
    else {
        throw new Error('Error connecting Database on Server');
    }

}
let detailSemiProduct = async (req, res) => {
    getSemiProduct = await SemiProduct.aggregate([
        {


            $lookup: {
                from: "jobsheets",
                localField: "jobsheet_code",
                foreignField: "jobsheet_code",
                as: "getDetail"
            },
        },
        {
            $match: { semi_product_status: 'Đã gửi YCKT' }
        }

    ]);
    if (getSemiProduct) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
            data: getSemiProduct,
        });
    }
    else {
        throw new Error('Error connecting Database on Server');
    }

}
let checkProductQC = async (req, res) => {
    getProductCode = req.params.id;
    isCheck = await Product.find({ product_code: getProductCode }).count();
    //console.log(isCheck);
    if (isCheck > 0) {
        getProduct = await Product.updateOne({ product_code: getProductCode }, {
            $set: {
                product_tester: req.body.product_tester,
                product_test_date: req.body.product_test_date,
                product_note: req.body.product_note,
                product_result: req.body.product_result,
                product_status: 'Đã kiểm tra QC',
            }
        });
        if (getProduct) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
            });
        }
        getInfoProduct = await Product.findOne({ product_code: getProductCode });
        getQualityControl = await QualityControl.findOneAndUpdate({ jobsheet_code: getInfoProduct.jobsheet_code }, { quality_control_status: 'Đã kiểm tra QC' });
        //cập nhật trạng thái Jobsheet
        isCheckExits = await Product.findOne({
            $and: [{ jobsheet_code: getQualityControl.jobsheet_code }, {
                $or: [
                    { product_status: { $exists: false } },
                    { product_status: { $ne: 'Đã kiểm tra QC' } }
                ]
            }]
        }).count();

        if (isCheckExits === 0) {
            await JobSheet.updateOne({ jobsheet_code: getQualityControl.jobsheet_code }, { jobsheet_status: 'Đã kiểm tra QC' });
        }
        else {
            await JobSheet.updateOne({ jobsheet_code: getQualityControl.jobsheet_code }, { jobsheet_status: 'Đang kiểm tra QC' });
        }

    }
    else {
        res.json({
            status: 500,
            message: 'Field not exits',
        });
    }
}
let checkSemiProductQC = async (req, res) => {
    getSemiProductLot = req.params.id;
    console.log(getSemiProductLot);
    isCheck = await SemiProduct.find({ semi_product_lot: getSemiProductLot }).count();
    console.log(isCheck);
    if (isCheck > 0) {
        getSemiProduct = await SemiProduct.updateOne({ semi_product_lot: getSemiProductLot }, {
            $set: {
                semi_product_tester: req.body.product_tester,
                semi_product_test_date: req.body.product_test_date,
                semi_product_note: req.body.product_note,
                semi_product_result: req.body.product_result,
                semi_product_status: 'Đã kiểm tra QC',
            }
        });
        if (getSemiProduct) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
            });
        }
        getInfoSemiProduct = await SemiProduct.findOne({ semi_product_lot: getSemiProductLot });
        getQualityControl = await QualityControl.findOneAndUpdate({ jobsheet_code: getInfoSemiProduct.jobsheet_code }, { quality_control_status: 'Đã kiểm tra QC' });
        //cập nhật trạng thái Jobsheet
        console.log(getQualityControl);
        isCheckExits = await SemiProduct.findOne({
            $and: [{ jobsheet_code: getQualityControl.jobsheet_code }, {
                $or: [
                    { semi_product_status: { $exists: false } },
                    { semi_product_status: { $ne: 'Đã kiểm tra QC' } }
                ]
            }]
        }).count();
        console.log('check được là',isCheckExits);
        if (isCheckExits === 0) {
            await JobSheet.updateOne({ jobsheet_code: getQualityControl.jobsheet_code }, { jobsheet_status: 'Đã kiểm tra QC' });
        }
        else {
            await JobSheet.updateOne({ jobsheet_code: getQualityControl.jobsheet_code }, { jobsheet_status: 'Đang kiểm tra QC' });
        }

    }
    else {
        res.json({
            status: 500,
            message: 'Field not exits',
        });
    }
}
module.exports = {
    index: index,
    detailProduct: detailProduct,
    checkProductQC: checkProductQC,
    detailSemiProduct: detailSemiProduct,
    checkSemiProductQC: checkSemiProductQC,
}