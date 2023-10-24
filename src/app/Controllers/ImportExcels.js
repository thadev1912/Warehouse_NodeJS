// // Upload excel file and import to mongodb
// app.post('/uploadfile', upload.single("uploadfile"), (req, res) =>{
//     importExcelData2MongoDB(__dirname + '/uploads/' + req.file.filename);
//     console.log(res);
// });
const importExecl=async(req,res)=>{
      console.log('bạn muốn import excel à');
 }  
// // Import Excel File to MongoDB database
//  importExcelData2MongoDB(filePath){
//     // -> Read Excel File to Json Data
//     const excelData = excelToJson({
//         sourceFile: filePath,
//         sheets:[{
//             // Excel Sheet Name
//             name: 'Customers',
  
//             // Header Row -> be skipped and will not be present at our result object.
//             header:{
//                rows: 1
//             },
             
//             // Mapping columns to keys
//             columnToKey: {
//                 A: '_id',
//                 B: 'name',
//                 C: 'address',
//                 D: 'age'
//             }
//         }]
//     });
  
//     // -> Log Excel Data to Console
//     console.log(excelData);
// }
module.exports ={
    importExecl:importExecl,
}