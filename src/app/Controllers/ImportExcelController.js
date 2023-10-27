const fs = require('fs');
const Student = require('../models/student');
var excelToJson = require('convert-excel-to-json');
const importStudent = async (req, res) => {
    //console.log(req.file);
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
module.exports = {
    importStudent: importStudent,
    StudentForm:StudentForm,
}


