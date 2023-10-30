const JobSheet = require('../models/jobsheet');
const ProductOrder = require('../models/product_order');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
let HeaderReport = async (req, res) => {
    try {
        let getJobSheet = await JobSheet.find();
        let getProductOrder = await ProductOrder.find();
        let getProduct = await Product.find();
        let getSemiProduct = await SemiProduct.find();
        if (getJobSheet) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data:getJobSheet,getProductOrder,getProduct,getSemiProduct
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
    HeaderReport: HeaderReport,   
   
}