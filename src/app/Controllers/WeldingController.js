const Welding = require('../models/welding');
const JobSheet = require('../models/jobsheet');
const SemiProduct = require('../models/semi_product');
const CategoriesSim = require('../models/categories_sim');
const SimPackage = require('../models/sim_packages');
const { ObjectId } = require('mongodb');
let WeldingList =async (req,res)=> {
    getData=await Welding.find();
    if(getData)
    {
     return res.status(200).json({
         success: true,
         data: getData,
         message: 'Get Data Completed!!!'
     });
    }
}
let showDetailWelding = async (req, res) => {
    getJobSheetCode=req.params.id;
    //getJobSheetCode=req.body.oldjobsheetcode;
    
   getData =await JobSheet.aggregate([
    {
        $lookup: {
                        from: "semi_products",
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
let approveWeldingOrder =async (req,res) =>
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
let infotoUpdate =async(req,res)=>{
    getSemiProductLot=req.params.id;       
    getCategoriesSimNoneUse= await CategoriesSim.find({ use_sim: '0' });  //get sim none used
    getSimPackage=await SimPackage.find();
    getData=await SemiProduct.aggregate([
        {
            $lookup: {
                            from: "jobsheets",
                            localField: "jobsheet_code",
                            foreignField: "jobsheet_code",
                            as: "getDetail"
                        }
        },
          {
              $match:{semi_product_lot:getSemiProductLot}
          }
    
        
    ])
    if(getData)   
    {
     
       return res.status(200).json({
           success: true,
           data: getData,getCategoriesSimNoneUse,getSimPackage,
           message: 'Get Data Completed!!!'
       });
      }
      else {
          throw new Error('Error connecting Database on Server');
      }
}
let updateWeldingOrder=async (req,res) =>{
    getSemiProductLot=req.params.id;
    getOldSim= new ObjectId(req.body.old_sim);  
    getNewSim=req.body.categories_sim_id  
    getSemiProduct=new SemiProduct(req.body);    
    getData=  await SemiProduct.findOneAndUpdate({ semi_product_lot: getSemiProductLot }, { $set: req.body });
    InfoSemiProduct=await SemiProduct.findOne({ semi_product_lot: getSemiProductLot }); //lấy id semi-product thông qua id lot
    console.log(InfoSemiProduct);
    const getId = new ObjectId(InfoSemiProduct.categories_sim_id);
    console.log(InfoSemiProduct);
    //clear Old Sim
    if(getNewSim)
    {
        getCategoriesSim=new CategoriesSim({   
            _id:getId,                     
            activation_date: req.body.activation_date,
            purpose: req.body.purpose,
            sim_package_id: req.body.sim_package_id,
            expiration_date: req.body.expiration_date,
            semi_product_id:InfoSemiProduct._id,
            manage_sim_note:req.body.semi_product_note,
        })
      await CategoriesSim.findByIdAndUpdate(getId ,{use_sim: '1',$set:getCategoriesSim});
    }
    if(getOldSim)
    {
        getCategoriesSim=new CategoriesSim({   
            _id:getOldSim,                     
            activation_date: '',
            purpose: '',
            sim_package_id: '',
            expiration_date: '',
            semi_product_id:'',
            manage_sim_note:'',
        })
      await CategoriesSim.findByIdAndUpdate(getOldSim ,{use_sim: '0',$set:getCategoriesSim});
    }
    if(getData)   
    {
     
       return res.status(200).json({
           success: true,          
           message: 'Get Data Completed!!!'
       });
      }
      else {
          throw new Error('Error connecting Database on Server');
      }
}
let checkWelding =async(req,res)=>{
   
}
module.exports = {
    WeldingList:WeldingList,
    showDetailWelding: showDetailWelding,
    approveWeldingOrder:approveWeldingOrder,
    infotoUpdate:infotoUpdate,
    updateWeldingOrder:updateWeldingOrder,
    checkWelding:checkWelding,
   
}