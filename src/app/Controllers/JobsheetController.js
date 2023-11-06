const JobSheet = require('../models/jobsheet');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const ProductOrder = require('../models/product_order');
const ProductType = require('../models/product_type');
const ProductSeries = require('../models/product_series');
const Welding = require('../models/welding');
const Assemble = require('../models/assemble');
const ProductGroup = require('../models/product_group');
const QualityControl = require('../models/quality_control');
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
        createDay = String(getDateTime.getDate()).padStart(2, '0');
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
                    product_status: '0',
                    product_assemble_status:'0',
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
                    semi_product_status: '0',
                    semi_product_welding_status:'0',
                    semi_product_used:'0',
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
        getJobSheet.jobsheet_status = '0';
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
            createDay = String(getDateTime.getDate()).padStart(2, '0');
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
                        product_status: '0'
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
                        semi_product_status: '0',
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
let showDetail = async (req, res) => {
    getJobSheetCode = req.params.id;
    const index = 6 - 1;
    if (index >= 0 && index < getJobSheetCode.length) {
        const createProductionType = getJobSheetCode.charAt(index);
        if ((createProductionType == 'P') || (createProductionType == 'R')) {
            getshowDetail = await JobSheet.aggregate([
                {
                    $lookup: {
                        from: "products",
                        localField: "jobsheet_code",
                        foreignField: "jobsheet_code",
                        as: "dataProduct"
                    }
                },
                {
                    $match: {
                        jobsheet_code: getJobSheetCode
                    }
                }
            ])

            return res.status(200).json({
                success: true, data: getshowDetail, message: 'Infomation field has been updated !!!'
            });

        }
        else if ((createProductionType == 'S') || (createProductionType == 'N')) {
            getshowDetail = await JobSheet.aggregate([
                {
                    $lookup: {
                        from: "semi_products",
                        localField: "jobsheet_code",
                        foreignField: "jobsheet_code",
                        as: "dataSemiProduct"
                    }
                },
                {
                    $match: {
                        jobsheet_code: getJobSheetCode
                    }
                }
            ])

            return res.status(200).json({
                success: true, data: getshowDetail, message: 'Infomation field has been updated !!!'
            });
        }

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

        getId = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {

            for (let i = 0; i < getId.length; i++) {
                await Product.findOneAndUpdate({ product_code: getId[i] }, { product_status: '1' })
            }

        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            for (let i = 0; i < getId.length; i++) {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getId[i] }, { semi_product_status: '1' });
            }

        }
        isCompleted = await JobSheet.findOneAndUpdate({ jobsheet_code: getJobSheetCode }, { jobsheet_status: '1' });
        if (isCompleted) {
            res.json({
                status: 200,
                messege: 'Update field comleted!!!',
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
        console.log(req.body);
        getId = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {

            for (let i = 0; i < getId.length; i++) {
                await Product.findOneAndUpdate({ product_code: getId[i] }, { product_status: '2' })
            }

        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
            for (let i = 0; i < getId.length; i++) {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getId[i] }, { semi_product_status: '2' });
            }

        }
        if (getInfo) {
            res.json({
                status: 200,
                messege: 'Update field comleted!!!',
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
let OrderProduct = async (req, res) => {
    try {       
        getId = req.body.arrayProductID;
        getJobSheetCode = req.body.jobsheetCode;
        getInfo = await JobSheet.findOne({ jobsheet_code: getJobSheetCode }).select('product_type_code');
        getProductionType = getInfo.product_type_code;
        if ((getProductionType == 'P') || (getProductionType == 'R')) {
          //tạo bảng Assemble (Thành phẩm)
          isCheckJobsheetCode= await Assemble.findOne({jobsheet_code:getJobSheetCode}).count();
          console.log('đếm được là',isCheckJobsheetCode);
          let today = new Date();
          dd = String(today.getDate()).padStart(2, '0');
          mm = String(today.getMonth() + 1).padStart(2, '0');
          yyyy = today.getFullYear();
          createDay = mm + '/' + dd + '/' + yyyy;

          for (let i = 0; i < getId.length; i++) {           
                await Product.findOneAndUpdate({ product_code: getId[i] },{$set:{product_status: '3' ,semi_product_assemble_status: '1'}});
          }
          isCheckJobsheetCode= await Assemble.find({jobsheet_code:getJobSheetCode}).count();
          if(isCheckJobsheetCode===0)
          {
            getAssemble = new Assemble({
                jobsheet_code: getJobSheetCode,
                assemble_create_date: createDay,
                assemble_status: '0'
            });
            getData = await getAssemble.save();
          }
         
        }
        else if ((getProductionType == 'N') || (getProductionType == 'S')) {
              //tạo bảng Prduct ( Bán Thành phẩm)
              let today = new Date();
              dd = String(today.getDate()).padStart(2, '0');
              mm = String(today.getMonth() + 1).padStart(2, '0');
              yyyy = today.getFullYear();
              createDay = mm + '/' + dd + '/' + yyyy;  
             
             
              for (let i = 0; i < getId.length; i++) {
                await SemiProduct.findOneAndUpdate({ semi_product_lot: getId[i] }, { $set:{ semi_product_status: '3',semi_product_welding_status: '1'}});                 
              }
              isCheckJobsheetCode= await Welding.find({jobsheet_code:getJobSheetCode}).count();
              console.log('đếm được là',isCheckJobsheetCode);
              if(isCheckJobsheetCode===0)
              {
                getWelding = new Welding({
                    jobsheet_code: getJobSheetCode,
                    welding_create_date: createDay,
                    welding_status: '0'
                });
                getData = await getWelding.save();
              }
        }
        if (getInfo) {
            res.json({
                status: 200,
                messege: 'Update field comleted!!!',
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
let infoCreatOrderQC = async (req, res) => {
    getProductCode = req.params.id;
    getProductGroup = await ProductGroup.find();
    if (getProductGroup) {
        return res.status(200).json({
            success: true, message: 'Get Data Completed !!!', getProductGroup
        });
    }
}
let OrderProductQC = async (req, res) => {
    //   Công thức : QC   28  E 23  R   M  50  P 001
    console.log(req.body);
    getProductCode = req.params.id;
    console.log(getProductCode);
    const getDateTime = new Date();
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    const month = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    createDay = String(getDateTime.getDate()).padStart(2, '0');
    createMonth = month[getDateTime.getMonth()];
    createYear = getDateTime.getFullYear(); createYear = createYear.toString().substr(-2);
    createTypeQualityControl = req.body.type_quality_control   //loại kiểm tra (T or R)
    createTypeProducttoCheck = req.body.type_product_to_check  //loại sản phẩm cần test ( M/S/P)
    createTypeProductGroup = req.body.type_product_group   //mã dòng sản phẩm
    getCount = await QualityControl.find({ created: { $gte: start, $lt: end } }).count();
    getCount += 1;
    createQuantity = String(getCount).padStart(3, '0');  //lấy số lượng
    console.log('đếm được là:', createQuantity);
    mergeCodeQualityControl = 'QC' + createYear + createMonth + createDay + createTypeQualityControl + createTypeProducttoCheck + createTypeProductGroup + createQuantity;
    console.log(mergeCodeQualityControl);
    await Product.updateOne({ product_code: getProductCode }, { product_status: 'Đã gửi YCKT' });
    getInfoProduct = await Product.find({ product_code: getProductCode });
    const getValue = getInfoProduct[0];
    getQuantityControl = new QualityControl({
        quality_control_code: mergeCodeQualityControl,
        jobsheet_code: getValue.jobsheet_code,
        quality_control_specification: req.body.quality_control_specification,
    });
    getData = await getQuantityControl.save();
    isCheckExits = await Product.findOne({
        $and: [{ jobsheet_code: getValue.jobsheet_code }, {
            $or: [
                { product_status: { $exists: false } },
                { product_status: { $ne: 'Đã gửi YCKT' } }
            ]
        }]
    }).count();
    console.log(isCheckExits);
    if (isCheckExits === 0) {
        await JobSheet.updateOne({ jobsheet_code: getValue.jobsheet_code }, { jobsheet_status: 'Đã kiểm tra' });
    }
    else {
        await JobSheet.updateOne({ jobsheet_code: getValue.jobsheet_code }, { jobsheet_status: 'Đang kiểm tra' });
    }
    if (getData) {
        return res.status(200).json({
            success: true, message: 'Infomation field has been updated !!!'
        });
    }
}
let OrderSemiProductQC = async (req, res) => {
    //   Công thức : QC   28  E 23  R   M  50  P 001
    console.log(req.body);
    getSemiProductLot = req.params.id;
    console.log(getSemiProductLot);
    const getDateTime = new Date();
    var start = new Date();
    start.setHours(0, 0, 0, 0);
    var end = new Date();
    end.setHours(23, 59, 59, 999);
    // const curentDay = Date.now();
    // console.log(curentDay);
    const month = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    createDay = getDateTime.getDate();
    createMonth = month[getDateTime.getMonth()];
    createYear = getDateTime.getFullYear(); createYear = createYear.toString().substr(-2);
    createTypeQualityControl = req.body.type_quality_control   //loại kiểm tra (T or R)
    createTypeProducttoCheck = req.body.type_product_to_check  //loại sản phẩm cần test ( M/S/P)
    createTypeProductGroup = req.body.type_product_group   //mã dòng sản phẩm
    getCount = await QualityControl.find({ created: { $gte: start, $lt: end } }).count();
    getCount += 1;
    createQuantity = String(getCount).padStart(3, '0');  //lấy số lượng
    console.log('đếm được là:', createQuantity);
    mergeCodeQualityControl = 'QC' + createYear + createMonth + createDay + createTypeQualityControl + createTypeProducttoCheck + createTypeProductGroup + createQuantity;
    console.log(mergeCodeQualityControl);
    await SemiProduct.updateOne({ semi_product_lot: getSemiProductLot }, { semi_product_status: 'Đã gửi YCKT' });
    getInfoSemiProduct = await SemiProduct.find({ semi_product_lot: getSemiProductLot });
    const getValue = getInfoSemiProduct[0];
    getQuantityControl = new QualityControl({
        quality_control_code: mergeCodeQualityControl,
        jobsheet_code: getValue.jobsheet_code,
        quality_control_specification: req.body.quality_control_specification,
    });
    getData = await getQuantityControl.save();
    //console.log('giá trị thông tin', getValue.jobsheet_code);
    isCheckExits = await SemiProduct.findOne({
        $and: [{ jobsheet_code: getValue.jobsheet_code }, {
            $or: [
                { semi_product_status: { $exists: false } },
                { semi_product_status: { $ne: 'Đã gửi YCKT' } }
            ]
        }]
    }).count();
    console.log(isCheckExits);
    if (isCheckExits === 0) {
        await JobSheet.updateOne({ jobsheet_code: getValue.jobsheet_code }, { jobsheet_status: 'Đã kiểm tra' });
    }
    else {
        await JobSheet.updateOne({ jobsheet_code: getValue.jobsheet_code }, { jobsheet_status: 'Đang kiểm tra' });
    }
    if (getData) {
        return res.status(200).json({
            success: true, message: 'Infomation field has been updated !!!'
        });
    }
}
let OrderStoreProduct = async (req, res) => {
    getProductCode = req.params.id;
    console.log(getProductCode);
    getData = await Product.findOneAndUpdate({ product_code: getProductCode }, { product_status: 'Đã gửi YC Nhập Kho' });
    getInfoProduct = await Product.findOne({ product_code: getProductCode });
    console.log(getInfoProduct);
    //cập nhật trạng thái Jobsheet
    isCheckExits = await Product.findOne({
        $and: [{ jobsheet_code: getInfoProduct.jobsheet_code }, {
            $or: [
                { product_status: { $exists: false } },
                { product_status: { $ne: 'Đã gửi YC Nhập Kho' } }
            ]
        }]
    }).count();
    if (isCheckExits === 0) {
        await JobSheet.updateOne({ jobsheet_code: getInfoProduct.jobsheet_code }, { jobsheet_status: 'Đã gửi YC Nhập Kho' });
    }
    else {
        /////
    }
    if (getData) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
        });
    }

}
let OrderStoreSemiProduct = async (req, res) => {
    getSemiProductLot = req.params.id;
    console.log(getSemiProductLot);
    getData = await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { semi_product_status: 'Đã gửi YC Nhập Kho' });
    getInfoSemiProduct = await SemiProduct.findOne({ semi_product_code: getSemiProductLot });
    //cập nhật trạng thái Jobsheet
    isCheckExits = await SemiProduct.findOne({
        $and: [{ jobsheet_code: getInfoSemiProduct.jobsheet_code }, {
            $or: [
                { semi_product_status: { $exists: false } },
                { semi_product_status: { $ne: 'Đã gửi YC Nhập Kho' } }
            ]
        }]
    }).count();
    if (isCheckExits === 0) {
        await JobSheet.updateOne({ jobsheet_code: getInfoSemiProduct.jobsheet_code }, { jobsheet_status: 'Đã gửi YC Nhập Kho' });
    }
    else {
        ///
    }
    if (getData) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
        });
    }
}
let StoreProduct = async (req, res) => {
    getProductCode = req.params.id;
    console.log(getProductCode);
    getData = await Product.findOneAndUpdate({ product_code: getProductCode }, { product_status: 'Đã Nhập Kho' });
    getInfoProduct = await Product.findOne({ product_code: getProductCode });
    console.log(getInfoProduct);
    //cập nhật trạng thái Jobsheet
    isCheckExits = await Product.findOne({
        $and: [{ jobsheet_code: getInfoProduct.jobsheet_code }, {
            $or: [
                { product_status: { $exists: false } },
                { product_status: { $ne: 'Đã Nhập Kho' } }
            ]
        }]
    }).count();
    if (isCheckExits === 0) {
        await JobSheet.updateOne({ jobsheet_code: getInfoProduct.jobsheet_code }, { jobsheet_status: 'Đã Nhập Kho' });
    }
    else {
        /////
    }
    if (getData) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
        });
    }

}
let StoreSemiProduct = async (req, res) => {
    getSemiProductLot = req.params.id;
    console.log(getSemiProductLot);
    getData = await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { semi_product_status: 'Đã Nhập Kho' });
    getInfoSemiProduct = await SemiProduct.findOne({ semi_product_lot: getSemiProductLot });
    //cập nhật trạng thái Jobsheet
    isCheckExits = await SemiProduct.findOne({
        $and: [{ jobsheet_code: getInfoSemiProduct.jobsheet_code }, {
            $or: [
                { semi_product_status: { $exists: false } },
                { semi_product_status: { $ne: 'Đã Nhập Kho' } }
            ]
        }]
    }).count();
    if (isCheckExits === 0) {
        await JobSheet.updateOne({ jobsheet_code: getInfoSemiProduct.jobsheet_code }, { jobsheet_status: 'Đã Nhập Kho' });
    }
    else {
        ///
    }
    if (getData) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
        });
    }
}
module.exports = {
    index: index,
    store: store,
    infotoCreate: infotoCreate,
    edit: edit,
    update: update,
    cancel: cancel,
    showDetail: showDetail,
    OrderExportMaterials: OrderExportMaterials,
    ExportMaterials: ExportMaterials,
    OrderProduct: OrderProduct,    
    infoCreatOrderQC: infoCreatOrderQC,
    OrderProductQC: OrderProductQC,
    OrderSemiProductQC: OrderSemiProductQC,
    OrderStoreProduct: OrderStoreProduct,
    OrderStoreSemiProduct: OrderStoreSemiProduct,
    StoreProduct: StoreProduct,
    StoreSemiProduct: StoreSemiProduct,
}