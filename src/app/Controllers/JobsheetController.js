const JobSheet = require('../models/jobsheet');

let index = async (req, res) => {
    try {
        let getData = await JobSheet.find({});       ;
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

let store = async (req, res) => {
    try {
        const getDateTime = new Date();
        const month = ["J","F","M","A","M","J","J","A","S","O","N","D"];
      //  console.log(req.body); công thức: 21A02     N    1     R     N     010
       //------------------------------------------------------------------------
       createQuantity= String(req.body.product_quantity).padStart(3, '0');  //lấy số lượng
       createProductionType=req.body.production_type; //lấy loại sản xuất
       createProductionRange=req.body.product_range_id; //lấy dòng sản phẩm    
       createProductionType2=req.body.production_type; //lấy loại  sản phẩm sản xuất 
       createQuantityProductRange='1';  //số lượng dòng sản phẩm trong 1 ngày 
       createDay=getDateTime.getDate();
       createMonth=month[getDateTime.getMonth()];      
       createYear=getDateTime.getFullYear();createYear = createYear.toString().substr(-2);       
       mergeCodeJobshhet= createYear+createMonth+createDay+createProductionType2+createQuantityProductRange+createProductionRange+createProductionType+createQuantity;
      //--------------------------------------- ---------
      
           
        const getJobSheet = new JobSheet(req.body); 
        getJobSheet.jobsheet_code= mergeCodeJobshhet;   
        let getData = await getJobSheet.save();       
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
            });
        }
        else
        {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

// let edit = async (req, res) => {
//     try {
//         id = req.query.id;
//         getId = await JobSheet.findOne({ _id: id });
//         if (getId) {
//             return res.status(200).json({
//                 success: true, message: 'Infomation Field need to edit!!', data: getId,
//             });
//         }
//         else {
//             throw new Error('Error connecting Database on Server');

//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, error: err.message });
//     }

// }

// let update = async (req, res) => {
//     try {
//         let id = req.params.id;
//         getData = await JobSheet.findByIdAndUpdate(id, { $set: req.body })
//         if (getData) {           
//             getNewData = await JobSheet.findOne({ _id: id });
//             return res.status(200).json({
//                 success: true, data: getNewData, message: 'Infomation field has been updated !!!'
//             });
//         }
//         else {
//             throw new Error('Error connecting Database on Server');
//         }
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({ success: false, error: err.message });
//     }

// }
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
    // edit: edit,
    // update: update,
    // destroy: destroy,
}