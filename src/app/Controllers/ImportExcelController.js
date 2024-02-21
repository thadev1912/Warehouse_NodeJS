const fs = require('fs');
const DetailProductOrder = require('../models/detail_product_order');
const ProvinceIMS = require('../models/ims/province_ims');
const DistrictIMS = require('../models/ims/district_ims');
const WardsIMS = require('../models/ims/wards_ims');
const IncrementCode = require('../models/increment_code_product_order');
const CategoriesSim = require('../models/categories_sim');
const smartBump = require('../models/cm/smart_bump');
var excelToJson = require('convert-excel-to-json');
const Joi = require("joi");
const importDetailProductOrder = async (req, res) => {

    isCompleted = await DetailProductOrderForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);
    if (isCompleted) {
        return res.json({
            status: 200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status: 500,
            success: false,
            message: 'Error file, please check again'
        });
    }

}
const importProvinceIMS = async (req, res) => {
    try {
        isCompleted = await ProvinceIMSForm('./public/excels/' + req.file.filename);
        fs.unlinkSync(req.file.path);
        if (isCompleted) {
            return res.json({
                status: 200,
                success: true,
                data: isCompleted,
                message: 'Insert has been DataCompletd'
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error file, please check again'
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
const importDistrictIMS = async (req, res) => {
    isCompleted = await DistrictIMSForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);
    if (isCompleted) {
        return res.json({
            status: 200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status: 500,
            success: false,
            message: 'Error file, please check again'
        });
    }

}
const importWardsIMS = async (req, res) => {

    isCompleted = await WardsIMSForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);
    if (isCompleted) {
        return res.json({
            status: 200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status: 500,
            success: false,
            message: 'Error file, please check again'
        });
    }
}

const importCategoriesSim = async (req, res) => {
    isCompleted = await CategoriesSimForm('./public/excels/' + req.file.filename);
    console.log('giá trị completed Data', isCompleted)
    fs.unlinkSync(req.file.path);
    if (isCompleted.success) {
        return res.json({
            status: 200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status: 200,
            success: false,
            data: 'error',
            message: 'Duplicated, please check again'
        });
    }
}

const importSmartBump = async (req, res) => {
    isCompleted = await SmartBumpForm('./public/excels/' + req.file.filename);
    console.log('giá trị completed Data', isCompleted)
    fs.unlinkSync(req.file.path);
    if (isCompleted.success) {
        return res.json({
            status: 200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status: 200,
            success: false,
            data: 'error',
            message: 'Duplicated, please check again'
        });
    }
}
//-----------------------------------------------FORM MODEL-------------------------------------------//

const DetailProductOrderForm = async (filePath) => {
    lastInvoice = await IncrementCode.findOne().sort({ invoice_number: -1 }).select('invoice_number');
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'DetailProductOrder',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'detail_product_order_name',
                B: 'detail_product_order_quantity',
                C: 'detail_product_order_unit',
                D: 'detail_product_order_finish',
                E: 'detail_product_order_packing',
                F: 'detail_product_order_detail',
            }
        }]
    });

    const updatedExcelData = excelData.DetailProductOrder.map(item => {
        return {
            ...item,
            product_order_code: lastInvoice.invoice_number,
        };
    });
    return await DetailProductOrder.insertMany(updatedExcelData);
}

const ProvinceIMSForm = async (filePath) => {
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'provinces',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'province_id',
                B: 'province_name',
                C: 'location_area',
                D: 'location_name',
                E: "province_note"


            }
        }]
    });

    return await ProvinceIMS.insertMany(excelData.provinces);
}
const DistrictIMSForm = async (filePath) => {
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'districts',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'district_id',
                B: 'district_name',
                C: 'province_id',
                D: 'district_note',

            }
        }]
    });

    return await DistrictIMS.insertMany(excelData.districts);
}
const WardsIMSForm = async (filePath) => {
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'wards',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'wards_id',
                B: 'wards_name',
                C: 'district_id',
                D: 'wards_note',

            }
        }]
    });

    return await WardsIMS.insertMany(excelData.wards);
}

const CategoriesSimForm = async (filePath) => {
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'sims',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'sim_type',
                B: 'serial_sim',
                C: 'activation_date',
                D: 'expiration_date',
                E: 'sim_package_id',
                F: "use_sim"

            }
        }]
    });
    // const existingSerialSims = await CategoriesSim.distinct('serial_sim');
    // const duplicateSerialSims = excelData.sims.filter(sim => existingSerialSims.includes(sim.serial_sim));
    // if (duplicateSerialSims.length > 0) {
    //     return {
    //         success: false,
    //         message: 'Duplicate entries found for serial_sim: ' + duplicateSerialSims.map(sim => sim.serial_sim).join(', ')
    //     };
    // }

    // Insert data to MongoDB
    const insertedData = await CategoriesSim.insertMany(excelData.sims);
    return {
        success: true,
        data: insertedData
    };
}
const SmartBumpForm = async (filePath) => {
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'smartpump',
            header: {
                rows: 1
            },
            columnToKey: {
                A: 'seri_number',
                B: 'serial_sim',
                C: 'device_type',
                D: 'active_code',
                E: 'topic_subscribe',
                F: 'topic_publish',
                G: 'IMEI_board',
                H: 'entry_date',
                I: 'production_date',
                J: 'description',
                K: 'active_status'
            }
        }]
    });
    // const existingSerialSims = await CategoriesSim.distinct('serial_sim');
    // const duplicateSerialSims = excelData.sims.filter(sim => existingSerialSims.includes(sim.serial_sim));
    // if (duplicateSerialSims.length > 0) {
    //     return {
    //         success: false,
    //         message: 'Duplicate entries found for serial_sim: ' + duplicateSerialSims.map(sim => sim.serial_sim).join(', ')
    //     };
    // }

    // Insert data to MongoDB
    const insertedData = await smartBump.insertMany(excelData.smartpump);
    return {
        success: true,
        data: insertedData
    };
}



module.exports = {
    importDetailProductOrder: importDetailProductOrder,
    DetailProductOrderForm: DetailProductOrderForm,
    importProvinceIMS: importProvinceIMS,
    ProvinceIMSForm: ProvinceIMSForm,
    importDistrictIMS: importDistrictIMS,
    DistrictIMSForm: DistrictIMSForm,
    importWardsIMS: importWardsIMS,
    WardsIMSForm: WardsIMSForm,
    importCategoriesSim: importCategoriesSim,
    CategoriesSimForm: CategoriesSimForm,
    importSmartBump:importSmartBump,
    SmartBumpForm:SmartBumpForm,
  
}


