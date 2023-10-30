const Assemble = require('../models/assemble');
const JobSheet = require('../models/jobsheet');
let AssembleList =async (req,res)=> {
    getData=await Assemble.find();
    if(getData)
    {
     return res.status(200).json({
         success: true,
         data: getData,
         message: 'Get Data Completed!!!'
     });
    }
}
let showDetailAssemble = async (req, res) => {
    getJobSheetCode=req.params.id;   
    
    getData =await JobSheet.aggregate([
    {
        $lookup: {
                        from: "products",
                        localField: "jobsheet_code",
                        foreignField: "jobsheet_code",
                        as: "getDetail"
                    }
    },
      {
          $match:{jobsheet_code:getJobSheetCode}
      }
   ])
   if(getData)
   {
    return res.status(200).json({
        success: true,
        data: getData,
        message: 'Get Data Completed!!!'
    });
   }
   else {
    throw new Error('Error connecting Database on Server');
}
}
let approveAssembleOrder =async (req,res) =>
{
    getUser=req.body.username;    
    getSemiProductLot=req.params.id;       
   isCheck= await SemiProduct.updateOne({ semi_product_lot: getSemiProductLot }, {
        $set:{
            semi_product_assembler: getUser,semi_product_status:'Đang hàn mạch'
        }
      });
      //update Jobsheet/Welding
      getJobSheetCode= await SemiProduct.findOne({semi_product_lot: getSemiProductLot});      
      await JobSheet.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { jobsheet_status: 'Đang hàn mạch' });
      await Welding.findOneAndUpdate({ jobsheet_code: getJobSheetCode.jobsheet_code }, { welding_status: 'Đang hàn mạch' })
      if(isCheck)
      {
       
         return res.status(200).json({
             success: true,
             data: getData,
             message: 'Get Data Completed!!!'
         });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
}
module.exports ={
    AssembleList:AssembleList,
    showDetailAssemble:showDetailAssemble,
    approveAssembleOrder:approveAssembleOrder,
}