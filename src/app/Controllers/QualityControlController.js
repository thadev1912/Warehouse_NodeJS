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
let detailQC = async (req, res) => {
    try
    {
    getJobSheetCode = req.params.id;
    console.log(getJobSheetCode);
    getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
    getProductionType = getInfo.product_type_code;
    if ((getProductionType == 'P') || (getProductionType == 'R')) {
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

                $match: {
                    $and: [
                        {
                            product_qc_status: "1"
                        },
                        {
                            jobsheet_code: getJobSheetCode
                        }
                    ]
                }
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
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    else if ((getProductionType == 'N') || (getProductionType == 'S')) {
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
                $match: {
                    $and: [
                        {
                            semi_product_qc_status: "1"
                        },
                        {
                            jobsheet_code: getJobSheetCode
                        }
                    ]
                }
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

let orderQC = async (req, res) => {
    try {
    console.log(req.body);
    getJobSheetCode = req.body.jobsheetCode;
    getId = req.body.productId;
    getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');    
    getProductionType = getInfo.product_type_code;
    console.log(getProductionType);
    if ((getProductionType == 'P') || (getProductionType == 'R')) {
        isCheck = await Product.find({ jobsheet_code: getJobSheetCode }).count();
        console.log('kiểm tra tồn tại',isCheck); 
        if (isCheck > 0) {
            getProduct = await Product.updateOne({ product_code: getId }, {
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
            getSemiProduct = await SemiProduct.updateOne({ semi_product_lot: getId }, {
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

module.exports = {
    index: index,
    detailQC: detailQC,
    orderQC: orderQC,
}