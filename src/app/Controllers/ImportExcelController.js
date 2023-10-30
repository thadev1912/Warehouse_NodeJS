const fs = require('fs');
const Student = require('../models/student');
const DetailProductOrder = require('../models/detail_product_order');
const IncrementCode = require('../models/increment_code_product_order');
var excelToJson = require('convert-excel-to-json');
const importStudent = async (req, res) => {
   console.log(req.file);
    isCompleted = await StudentForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);   //delete file
    if (isCompleted) {
        return res.status(200).json({
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd !!!'
        });
    }
    else {
        return res.status(500).json({
            success: false,            
            message: 'Error file, please check again !!!'
        });
    }
    
}
const importDetailProductOrder = async (req, res) => {   
    console.log(req.body);
    isCompleted = await DetailProductOrderForm('./public/excels/' + req.file.filename);
    fs.unlinkSync(req.file.path);   //delete file
    if (isCompleted) {
        return res.status(200).json({
            success: true,
            data: isCompleted,
            message: 'Insert has been DataCompletd !!!'
        });
    }
    else {
        return res.status(500).json({
            success: false,            
            message: 'Error file, please check again !!!'
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
module.exports = {
    importStudent: importStudent,    
    StudentForm:StudentForm,
    importDetailProductOrder:importDetailProductOrder,
    DetailProductOrderForm:DetailProductOrderForm,
}


