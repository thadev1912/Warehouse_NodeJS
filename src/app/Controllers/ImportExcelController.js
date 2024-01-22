const fs = require('fs');
const Student = require('../models/student');
const DetailProductOrder = require('../models/detail_product_order');
const ProvinceIMS = require('../models/ims/province_ims');
const DistrictIMS = require('../models/ims/district_ims');
const WardsIMS = require('../models/ims/wards_ims');
const IncrementCode = require('../models/increment_code_product_order');
const CategoriesSim = require('../models/categories_sim');
var excelToJson = require('convert-excel-to-json');
const importStudent = async (req, res) => {
   console.log(req.file);
    isCompleted = await StudentForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);   //delete file
    if (isCompleted) {
        return res.json({
            status:200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status:500,
            success: false,            
            message: 'Error file, please check again'
        });
    }
    
}
const importDetailProductOrder = async (req, res) => {   
    console.log(req.body);
    isCompleted = await DetailProductOrderForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);   
    if (isCompleted) {
        return res.json({
            status:200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status:500,
            success: false,            
            message: 'Error file, please check again'
        });
    }
    
}
const importProvinceIMS = async (req, res) => {   
    console.log(req.body);
    isCompleted = await ProvinceIMSForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);  
    if (isCompleted) {
        return res.json({
            status:200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status:500,
            success: false,            
            message: 'Error file, please check again'
        });
    }
    
}
const importDistrictIMS = async (req, res) => {   
    console.log(req.body);
    isCompleted = await DistrictIMSForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);   
    if (isCompleted) {
        return res.json({
            status:200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status:500,
            success: false,            
            message: 'Error file, please check again'
        });
    }
    
}
const importWardsIMS = async (req, res) => {   
    console.log(req.body);
    isCompleted = await WardsIMSForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);  
    if (isCompleted) {
        return res.json({
            status:200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status:500,
            success: false,            
            message: 'Error file, please check again'
        });
    }    
}
const importCategoriesSim=async(req,res)=>
{
    console.log(req.body);
    isCompleted = await CategoriesSimForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);  
    if (isCompleted) {
        return res.json({
            status:200,
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd'
        });
    }
    else {
        return res.json({
            status:500,
            success: false,            
            message: 'Error file, please check again'
        });
    }    
}
//-----------------------------------------------FORM MODEL-------------------------------------------//
const StudentForm = async (filePath) => {
    const excelData = excelToJson({
        sourceFile: filePath,
        sheets: [{
            name: 'Students',
            header: {
                rows: 1
            },
            columnToKey: {
                A:'Student_Code',
                B:'Student_LastName',
                C:'Student_FirstName',
                D:'Address',
                E:'Phone',
                F:'Gender',
                G:'Course',
            }
        }]
    });   
    console.log('insert data', excelData);   
    return await Student.insertMany(excelData.Students);    
}
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
                A:'detail_product_order_name',
                B:'detail_product_order_quantity',
                C:'detail_product_order_unit',
                D:'detail_product_order_finish',
                E:'detail_product_order_packing',
                F:'detail_product_order_detail',
            }
        }]
    });  
       
    const updatedExcelData = excelData.DetailProductOrder.map(item => {
        return {
            ...item,
            product_order_code:lastInvoice.invoice_number,
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
                A:'province_id',
                B:'province_name',
                C:'province_note',
               
            }
        }]
    });   
    console.log('insert data', excelData);   
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
                A:'district_id',
                B:'district_name',
                C:'province_id',
                D:'district_note',
               
            }
        }]
    });   
    console.log('insert data', excelData);   
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
                A:'wards_id',
                B:'wards_name',
                C:'district_id',
                D:'wards_note',
               
            }
        }]
    });   
    console.log('insert data', excelData);   
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
               
                A:'serial_sim',
                B:'sim_type',
                C:'manage_sim_note',
               
            }
        }]
    });   
    console.log('insert data', excelData);   
    return await CategoriesSim.insertMany(excelData.sims);    
}
module.exports = {
    importStudent: importStudent,    
    StudentForm:StudentForm,   
    importDetailProductOrder:importDetailProductOrder,
    DetailProductOrderForm:DetailProductOrderForm,
    importProvinceIMS:importProvinceIMS,
    ProvinceIMSForm:ProvinceIMSForm,
    importDistrictIMS:importDistrictIMS,
    DistrictIMSForm:DistrictIMSForm,
    importWardsIMS:importWardsIMS,
    WardsIMSForm:WardsIMSForm,
    importCategoriesSim:importCategoriesSim,
    CategoriesSimForm:CategoriesSimForm,
}


