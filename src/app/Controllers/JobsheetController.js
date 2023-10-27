const JobSheet = require('../models/jobsheet');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const ProductOrder = require('../models/product_order');
const ProductType = require('../models/product_type');
const ProductSeries = require('../models//product_series');
const { ObjectId } = require('mongodb');
let index = async (req, res) => {
    try {
        let getData = await JobSheet.find({});;
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
let infotoCreate = async (req, res) => {

    let getproductOrderNo = await ProductOrder.find().select('product_order_No');
    let getproductType = await ProductType.find();
    let getproductSeries = await ProductSeries.find();
    if (getproductOrderNo && getproductType && getproductSeries) {
        return res.status(200).json({
            success: true, message: 'Infomation Field need to edit!!', getproductOrderNo, getproductType, getproductSeries
        });
    }
    else {
        throw new Error('Error connecting Database on Server');

    }
}
let store = async (req, res) => {
    try {
        const getDateTime = new Date();
        const month = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
        //  console.log(req.body); công thức: 21A02     N    1     R     N     010
        //------------------------------------------------------------------------
        createQuantity = String(req.body.product_quantity).padStart(3, '0');  //lấy số lượng
        createProductionStyle = req.body.production_style; //lấy loại sản xuất (N or F)
        createProductionSeries = req.body.product_series_code; //lấy dòng sản phẩm    
        createProductionType = req.body.product_type_code; //lấy loại  sản phẩm sản xuất ( thành phẩm hoặc bán thành phẩm)      ;
        createQuantityProductSeries = '1';  //số lượng dòng sản phẩm trong 1 ngày 
        createDay = getDateTime.getDate();
        createMonth = month[getDateTime.getMonth()];
        createYear = getDateTime.getFullYear(); createYear = createYear.toString().substr(-2);
        mergeCodeJobsheet = createYear + createMonth + createDay + createProductionType + createQuantityProductSeries + createProductionSeries + createProductionStyle + createQuantity;
        //--------------------------------------- ---------
        //*****************RUN LOOP******************** */  
        //công thức Thành phẩm: (R & P)  --Bán thành phẩm ( N & S)   
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
                    product_status: 'Mới tạo'
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
                    semi_product_status: 'Mới tạo',
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
        let getData = await getJobSheet.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
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

let edit = async (req, res) => {
    try {
        let id = new ObjectId(req.params.id);
        let getproductOrderNo = await ProductOrder.find().select('product_order_No');
        let getproductType = await ProductType.find();
        let getproductSeries = await ProductSeries.find();
        getId = await JobSheet.aggregate
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
            ]);
        if (getId) {
            return res.status(200).json({
                success: true, message: 'Infomation Field need to edit!!', data: getId, getproductOrderNo, getproductType, getproductSeries
            });
        }
        else {
            throw new Error('Error connecting Database on Server');

        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}

let update = async (req, res) => {
    try {
        console.log(req.body);
        let id = req.params.id;
       let OldJobsheetCode = req.body.oldjobsheetcode;
        //let OldJobsheetCode=req.body.old_jobsheet_code;
        let getQuantity = req.body.product_quantity;
       
        if (getQuantity) {
            const getDateTime = new Date();
            const month = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
            //  console.log(req.body); công thức: 21A02     N    1     R     N     010
            //------------------------------------------------------------------------
            createQuantity = String(req.body.product_quantity).padStart(3, '0');  //lấy số lượng
            createProductionStyle = req.body.production_style; //lấy loại sản xuất (N or F)
            createProductionSeries = req.body.product_series_code; //lấy dòng sản phẩm    
            createProductionType = req.body.product_type_code; //lấy loại  sản phẩm sản xuất ( thành phẩm hoặc bán thành phẩm)      ;
            createQuantityProductSeries = '1';  //số lượng dòng sản phẩm trong 1 ngày 
            createDay = getDateTime.getDate();
            createMonth = month[getDateTime.getMonth()];
            createYear = getDateTime.getFullYear(); createYear = createYear.toString().substr(-2);
            mergeCodeJobsheet = createYear + createMonth + createDay + createProductionType + createQuantityProductSeries + createProductionSeries + createProductionStyle + createQuantity;
            //công thức Thành phẩm: (R & P)  --Bán thành phẩm ( N & S)   
            if ((createProductionType == 'P') || (createProductionType == 'R')) {
                //kiểm tra trước khi xóa                    
                let checkExits = await Product.findOne({ jobsheet_code: OldJobsheetCode }).count();
                //console.log(checkExits); 
                if (checkExits > 0) {
                    await Product.deleteMany({ jobsheet_code: OldJobsheetCode });
                }
                // console.log('giá trị cần xóa',checkExits);             
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
                        product_status: 'Mới tạo'
                    });

                    await getProduct.save();
                }

            }
            else if ((createProductionType == 'N') || (createProductionType == 'S')) {
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
                        semi_product_status: 'Mới tạo',
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
        getData = await JobSheet.findByIdAndUpdate(id, { $set: req.body });
        if (getData) {           
            getNewData = await JobSheet.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
// let destroy = async (req, res) => {
//     try {
//         let id = req.query.id;
//         getId = await JobSheet.findByIdAndRemove({ _id: id });
//         if (getId) {

//             return res.status(200).json({
//                 success: true, message: 'This field has been removed!!!',
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

//}
module.exports = {
    index: index,
    store: store,
    infotoCreate: infotoCreate,
    edit: edit,
    update: update,
    // destroy: destroy,
}