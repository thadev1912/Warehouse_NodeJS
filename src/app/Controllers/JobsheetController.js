const JobSheet = require('../models/jobsheet');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const ProductOrder = require('../models/product_order');
const ProductType = require('../models/product_type');
const ProductSeries = require('../models/product_series');
const Welding = require('../models/welding');
const Assemble = require('../models/assemble');
const { ObjectId } = require('mongodb');
let index = async (req, res) => {
    try {
        let getproductOrderNo = await ProductOrder.find().select('product_order_No');
        let getproductType = await ProductType.find();
        let getproductSeries = await ProductSeries.find();
        let getData = await JobSheet.find({});;
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData, getproductOrderNo, getproductType, getproductSeries
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
        console.log(req.body);
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
        getJobSheet.jobsheet_status = 'Mới tạo';
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
        //  console.log(req.body);
        let id = req.params.id;
        let OldJobsheetCode = req.body.oldjobsheetcode;
        checkId = await JobSheet.findOne({ _id: id });
        if (checkId == null) {
            res.json({
                status: 400,
                messege: 'This Id no exits!!!',

            });
        }
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
                //kiểm tra trước khi xóa                    
                let checkExits = await SemiProduct.findOne({ jobsheet_code: OldJobsheetCode }).count();
                if (checkExits > 0) {
                    await SemiProduct.deleteMany({ jobsheet_code: OldJobsheetCode });
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
        req.body.jobsheet_code = mergeCodeJobsheet;
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
            jobsheet_status: 'Đã hủy',
        })
        getData = await JobSheet.findByIdAndUpdate(id, { $set: updateJobSheet });
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            await Product.updateMany({ jobsheet_code: getJobSheetCode }, { product_status: 'Đã hủy' })

        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { semi_product_status: 'Đã hủy' })
        }
        if (getData) {
            getNewData = await JobSheet.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
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
let OrderExportMaterials = async (req, res) => {
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
            jobsheet_status: 'Đã yêu cầu xuất kho NVL',
        })
        getData = await JobSheet.findByIdAndUpdate(id, { $set: updateJobSheet });
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            await Product.updateMany({ jobsheet_code: getJobSheetCode }, { product_status: 'Đã yêu cầu xuất kho NVL' })

        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { semi_product_status: 'Đã yêu cầu xuất kho NVL' })
        }
        if (getData) {
            getNewData = await JobSheet.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
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
let ExportMaterials = async (req, res) => {
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
            jobsheet_status: 'Đã xuất kho NVL',
        })
        getData = await JobSheet.findByIdAndUpdate(id, { $set: updateJobSheet });
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
            await Product.updateMany({ jobsheet_code: getJobSheetCode }, { product_status: 'Đã xuất kho NVL' })

        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { semi_product_status: 'Đã xuất kho NVL' })
        }
        if (getData) {
            getNewData = await JobSheet.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
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
let OrderWedling = async (req, res) => {
    getJobSheetCode = req.body.oldjobsheetcode;
    console.log(getJobSheetCode);
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    getWelding = new Welding({
        jobsheet_code: getJobSheetCode,
        welding_create_date: createDay,
        welding_status: 'Mới tạo'
    })
    await SemiProduct.updateMany({ jobsheet_code: getJobSheetCode }, { semi_product_status: 'Đã gửi YCHM' });
    await JobSheet.updateMany({ jobsheet_code: getJobSheetCode }, { jobsheet_status: 'Đã gửi YCHM' });
    getData = await getWelding.save();
    if (getData) {
        return res.status(200).json({
            success: true, message: 'Infomation field has been updated !!!'
        });
    }
}
let OrderAssemble = async (req, res) => {
    getJobSheetCode = req.body.oldjobsheetcode;
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    getAssemble = new Assemble({
        jobsheet_code: getJobSheetCode,
        assemble_create_date: createDay,
        assemble_status: 'Mới tạo'
    });
    await Product.updateMany({ jobsheet_code: getJobSheetCode }, { product_status: 'Đã gửi YCLR' });
    await JobSheet.updateMany({ jobsheet_code: getJobSheetCode }, { jobsheet_status: 'Đã gửi YCLR' });
    getData = await getAssemble.save();
    if (getData) {
        return res.status(200).json({
            success: true, message: 'Infomation field has been updated !!!'
        });
    }
}
let OrderProductQC = async (req, res) => {
    getProductCode = req.body.product_code;
    await Product.updateOne({ product_code: getProductCode }, { product_status: 'Đã gửi YCKT' });
    getInfoProduct = await Product.find({ product_code: getProductCode });
    const getValue = getInfoProduct[0];
    //console.log('giá trị thông tin', getValue.jobsheet_code);
    isCheckExits = await Product.findOne({
        $and: [{ jobsheet_code: getValue.jobsheet_code }, {
            $or: [
                { product_status: { $exists: false } },
                { product_status: { $ne: 'Đã gửi YCKT' } }
            ]
        }]
    }).count();
    if (isCheckExits === 0) {
        await JobSheet.updateOne({ jobsheet_code: getInfoProduct.jobsheet_code }, { jobsheet_status: 'Hoàn Thành'});
    }
    else
    {
        await JobSheet.updateOne({ jobsheet_code: getInfoProduct.jobsheet_code }, { jobsheet_status: 'Đang kiểm tra'});
    }
    if (getInfoProduct) {
        return res.status(200).json({
            success: true, message: 'Infomation field has been updated !!!'
        });
    }
}
let OrderSemiProductQC =async(req,res)=>{
   res.json('bạn đang gọi tôi à');
}
module.exports = {
    index: index,
    store: store,
    infotoCreate: infotoCreate,
    edit: edit,
    update: update,
    cancel: cancel,
    OrderExportMaterials: OrderExportMaterials,
    ExportMaterials: ExportMaterials,
    OrderWedling: OrderWedling,
    OrderAssemble: OrderAssemble,
    OrderProductQC: OrderProductQC,
    OrderSemiProductQC:OrderSemiProductQC,
}