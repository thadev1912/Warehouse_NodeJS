
const DetailManagerWMS = require('../../models/wms/detail_mangager_wms');
const ManagerWMS = require('../../models/wms/manager_wms');
const StandardWMS = require('../../models/wms/standard_wms');
const ProvincesIMS = require('../../models/ims/province_ims');
const CategoriesSim = require('../../models/categories_sim');
const Product = require('../../models/product');
const SemiProduct = require('../../models/semi_product');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
const { ObjectId } = require('mongodb');
const fs = require('fs');
const { paginate1 } = require('../../../helper/pagination');
let index = async (req, res) => {
    try {
        const token = req.headers.token;
        getId = new ObjectId(req.params.id);
        getinfoManagerWMS = await ManagerWMS.findOne({ _id: getId });
        _getProvinceId = await ProvincesIMS.findOne({ province_id: getinfoManagerWMS.area_id });
        getProvinceId = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProvincesIMS.findOne({ province_id: getinfoManagerWMS.area_id }).select(['province_id', 'province_name']));
        getCategoriesSim = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await CategoriesSim.find({ use_sim: 1 }));
        // getProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.aggregate([

        //     {
        //         $match: {
        //             $and: [
        //                 { product_status: '9' },
        //                 { product_result: '1' },
        //                 { product_used: '0' }
        //             ]
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "semi_products",
        //             localField: "semi_product_lot",
        //             foreignField: "semi_product_lot",
        //             pipeline: [
        //                 {
        //                     $addFields: {
        //                         categories_sim_id: { $toObjectId: "$categories_sim_id" }
        //                     },
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "categories_sims",
        //                         localField: "categories_sim_id",
        //                         foreignField: "_id",
        //                         pipeline: [
        //                             {
        //                                 $addFields: {
        //                                     sim_package_id: { $toObjectId: "$sim_package_id" }
        //                                 },
        //                             },
        //                             {
        //                                 $lookup: {
        //                                     from: "sim-packages",
        //                                     localField: "sim_package_id",
        //                                     foreignField: "_id",
        //                                     as: "getPackage",
        //                                 },
        //                             },
        //                         ],
        //                         as: "getSim",
        //                     },
        //                 },
        //             ],
        //             as: "GetSemiProduct",
        //         }
        //     }
        // ]));
        getProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.aggregate([
            {
                $match: {
                    product_status: '9',
                    product_result: '1',
                    product_used: '0'
                }
            },
            {
                $lookup: {
                    from: "semi_products",
                    let: { semiProductLot: "$semi_product_lot" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ["$semi_product_lot", "$$semiProductLot"] }
                            }
                        },
                        {
                            $addFields: {
                                categories_sim_id: { $toObjectId: "$categories_sim_id" }
                            },
                        },
                        {
                            $lookup: {
                                from: "categories_sims",
                                let: { catSimId: "$categories_sim_id" },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { $eq: ["$_id", "$$catSimId"] }
                                        }
                                    },
                                    {
                                        $addFields: {
                                            sim_package_id: { $toObjectId: "$sim_package_id" }
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: "sim-packages",
                                            localField: "sim_package_id",
                                            foreignField: "_id",
                                            as: "getPackage",
                                        },
                                    },
                                ],
                                as: "getSim",
                            },
                        },
                    ],
                    as: "GetSemiProduct",
                }
            }
        ]));       
       
        _getData = await DetailManagerWMS.aggregate([
            {
                $match: {
                    area_id: _getProvinceId.province_id
                }
            },
            {
                $sort: {
                    created: -1
                }
            },
        ]);
        _getData.forEach(item => {
            item.standard = JSON.parse(item.standard);
        });
        getData = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, _getData);
        getStandard = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await StandardWMS.find().select(['standard_code', 'standard_name']));
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data: getData, getProvinceId, getStandard, getCategoriesSim, getProduct,
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
const showSeriSimbyId = async (req, res) => {
    try {
        getIdSim = req.params.id;
        console.log(getIdSim);
        getCategoriesSim = await CategoriesSim.find({ _id: getIdSim });
        console.log(getCategoriesSim);
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let store = async (req, res) => {
    try {            
        req.body.location_area = req.body.area_id > 100 ? 'JP' : 'VN';
        getProductCode = req.body.product_code;
        isCompleted = true;
        if (req.files) {
            const getArrImage = req.files;
            console.log('giá trị ảnh', getArrImage);
            const getStandard = req.body.standard;
            console.log(getStandard);
            const CovertArrayImageToJson = JSON.stringify(getArrImage.map(file => 'uploads/WMS/' + file.originalname));
            req.body.image = CovertArrayImageToJson;
            const getDetailManagerWMS = new DetailManagerWMS(req.body);
            if (getProductCode) {
                await Product.findOneAndUpdate({ product_code: getProductCode }, { product_used: '1' });
            }          
            let saveData = await getDetailManagerWMS.save();
            countActiveStatus();
            isCompleted = saveData ? true : false;
        }
        else {
            const getDetailManagerWMS = new DetailManagerWMS(req.body);
            let saveData = await getDetailManagerWMS.save();
            countActiveStatus();
            isCompleted = saveData ? true : false;
        }
        if (isCompleted) {
            res.json({
                status: 200,
                messege: 'Add new field completed',
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let update = async (req, res) => {
    try {
        console.log(req.params.id);
        //Có sự thay đổi hình ảnh....
        console.log(req.body);
        console.log(req.files);
        if (req.files) {
            getArrDelete = req.body.delete_images;
            //***********GENERAL**********
            let id = req.params.id;
            const _getArrImage_New = req.files;
          //  getProductCode=req.body.product_code;
          //  getOldProductCode=req.body.old_product_code;
         //   console.log(getProductCode);
            const getArrImage_New = [];
            _getArrImage_New.forEach(item => {
                getArrImage_New.push(item.originalname);
            });
            getInfo = await DetailManagerWMS.find({ _id: id });
            _getArrNameImage = getInfo[0].image;
            const _getArrImage_Old = JSON.parse(_getArrNameImage);
            const getArrImage_Old = _getArrImage_Old.map(path => {
                const getArrImage_Old = path.substring(path.lastIndexOf('/') + 1);
                return getArrImage_Old;
            });
            if (getArrDelete === 'undefined') {
                getArrUpdate = getArrImage_Old.concat(getArrImage_New);
                const CovertArrayImageToJson = JSON.stringify(getArrUpdate.map(fileName => 'uploads/WMS/' + fileName));
                req.body.image = CovertArrayImageToJson;
                // if (getOldProductCode) {
                //     await Product.findOneAndUpdate({ product_code: getProductCode }, { product_used: '0' });
                // } 
                // if(getProductCode)
                // {
                //     await Product.findOneAndUpdate({ product_code: getProductCode }, { product_used: '1' });
                // }
                getData = await DetailManagerWMS.findByIdAndUpdate(id, { $set: req.body });
                countActiveStatus();
                if (getData) {
                    getNewData = await DetailManagerWMS.findOne({ _id: id });
                    res.json({
                        status: 200,
                        messege: 'Infomation field has been updated',
                    });
                }
                else {
                    return res.json({
                        status: 500,
                        success: false,
                        message: 'Error connecting Database on Server'
                    });
                }
            }
            else {
                _getArrDelete = JSON.parse(getArrDelete);
                isComplete = true;
                for (const fileName of _getArrDelete) {
                    const filePath = './public/uploads/WMS/' + fileName;
                    if (fs.existsSync(filePath)) {
                        await fs.unlink(filePath, (err) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            console.log(`Tệp ảnh '${fileName}' đã được xóa khỏi storage của multer`);
                        });
                    }
                    const index = getArrImage_Old.indexOf(fileName);
                    if (index !== -1) {
                        getArrImage_Old.splice(index, 1);
                    }
                    getArrUpdate = getArrImage_Old.concat(getArrImage_New);
                    const CovertArrayImageToJson = JSON.stringify(getArrUpdate.map(fileName => 'uploads/WMS/' + fileName));
                    req.body.image = CovertArrayImageToJson;
                    // if (getOldProductCode) {
                    //     await Product.findOneAndUpdate({ product_code: getProductCode }, { product_used: '0' });
                    // } 
                    // if(getProductCode)
                    // {
                    //     await Product.findOneAndUpdate({ product_code: getProductCode }, { product_used: '1' });
                    // }
                    getData = await DetailManagerWMS.findByIdAndUpdate(id, { $set: req.body });
                    countActiveStatus();
                    isComplete = getData ? true : false;
                };
                if (isComplete) {
                    getNewData = await DetailManagerWMS.findOne({ _id: id });
                    res.json({
                        status: 200,
                        messege: 'Infomation field has been updated',
                    });
                }
                else {
                    return res.json({
                        status: 500,
                        success: false,
                        message: 'Error connecting Database on Server'
                    });
                }
            }
        }
        // Không có sự thay đổi hình ảnh....
        else {
            console.log('vao toi day!!!');
            console.log(req.body);
            let id = req.params.id;
            // if (getOldProductCode) {
            //     await Product.findOneAndUpdate({ product_code: getProductCode }, { product_used: '0' });
            // } 
            // if(getProductCode)
            // {
            //     await Product.findOneAndUpdate({ product_code: getProductCode }, { product_used: '1' });
            // }
            getData = await DetailManagerWMS.findByIdAndUpdate(id, { $set: req.body });
            countActiveStatus();
            if (getData) {
                getNewData = await DetailManagerWMS.findOne({ _id: id });
                res.json({
                    status: 200,
                    messege: 'Infomation field has been updated',
                    data: getNewData,
                });
            }
            else {
                return res.json({
                    status: 500,
                    success: false,
                    message: 'Error connecting Database on Server'
                });
            }
        }
    }

    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let destroy = async (req, res) => {
    try {
        let id = new ObjectId(req.params.id);
        getId = await DetailManagerWMS.findByIdAndRemove({ _id: id });
        countActiveStatus();
        if (getId) {
            res.json({
                success: true,
                status: 200,
                messege: 'This field has been removed',
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
const countActiveStatus = async (req, res) => {
    _countInstalled = await DetailManagerWMS.aggregate([
        {
            $group: {
                _id: "$area_id",
                totalStation: { $sum: 1 },
                totalInstalled: { $sum: { $toInt: "$installed" } },
                active_status: {
                    $sum: { $cond: [{ $eq: ["$active_status", 1] }, 1, 0] }
                },
                inactive_status: {
                    $sum: { $cond: [{ $eq: ["$active_status", 0] }, 1, 0] }
                },
                maintenance_status: {
                    $sum: { $cond: [{ $eq: ["$active_status", 2] }, 1, 0] }
                }
            }
        }
    ]);   
    const updateManagerWMS = await _countInstalled.map(function (data) {      
        return ManagerWMS.findOneAndUpdate(
            { area_id: data._id },
            {
                $set: {
                    installed:data.totalInstalled,
                    active_status: data.active_status,
                    inactive_status: data.inactive_status,
                    maintenance_status: data.maintenance_status,
                    totalStation: data.totalStation
                }
            },
            { new: true }
        );
    });
    return Promise.all(updateManagerWMS).then(data => {
        data.forEach(res => {
            res;
        })
    })
}

module.exports =
{
    index: index,
    store: store,
    update: update,
    destroy: destroy,
    showSeriSimbyId: showSeriSimbyId,
    countActiveStatus: countActiveStatus,
}