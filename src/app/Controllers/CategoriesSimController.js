
const CategoriesSim = require('../models/categories_sim');
const SemiProduct = require('../models/semi_product');
const Notification = require('../models/notification_sim');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
let index = async (req, res) => {
    try { 
        const token = req.headers.token; 
      await updateStatusSim();        
        let getSemiProduct =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await CategoriesSim.aggregate([           
            {
                $addFields: {                                      
                    semi_product_id: {
                        $cond: {
                            if: { $eq: ["$semi_product_id", ''] },
                            then: '',
                            else: { $toObjectId: "$semi_product_id" }
                        }
                    },
                    sim_package_id: {
                        $cond: {
                            if: { $eq: ["$sim_package_id", ''] },
                            then: '',
                            else: { $toObjectId: "$sim_package_id" }
                        }
                    },        
                   
                },
            },
            {
                $lookup: {
                    from: "semi_products",
                    localField: "semi_product_id",
                    foreignField: "_id",
                    as: "semi_products"
                }
            },
            {
                $lookup: {
                    from: "sim-packages",
                    localField: "sim_package_id",
                    foreignField: "_id",
                    as: "sim_package"
                }
            },
        ]));
        if (getSemiProduct) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getSemiProduct,
            });
        } else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
 //const covertData=await cryptJSon.decryptData(token,encryptionEnabled,getData) 
let updateStatusSim=async(res,req)=>
{          
        let updateStatusSim = await CategoriesSim.aggregate([           
            {
                $addFields: {  
                    warningDate: {                       
                       $subtract: ["$expiration_date", 30 * 24 * 60 * 60 * 1000] // Trừ 30 ngày
                    },  
                    semi_product_id: {
                        $cond: {
                            if: { $eq: ["$semi_product_id", ''] },
                            then: '',
                            else: { $toObjectId: "$semi_product_id" }
                        }
                    },
                    sim_package_id: {
                        $cond: {
                            if: { $eq: ["$sim_package_id", ''] },
                            then: '',
                            else: { $toObjectId: "$sim_package_id" }
                        }
                    },                  
                    sim_status: {
                        $cond: {
                            if: {
                                $eq:["$deadline_warning","Đã hết hạn"]
                               // $gte: ["$activation_date",new Date()] 
                            },
                            then: 'Đã hết hạn',
                          //  else: "Đã kích hoạt"
                            else:{
                                $cond: {
                                    if:{                                   
                                              $eq: ["$activation_date", ""],                                        
                                          },
                                     then: "",
                                      else: {
                                        $cond:{
                                            if:{$eq: [ { $ifNull: ["$activation_date", null] }, null]},
                                            then:'',
                                            else: "Đã kích hoạt"
                                        }
                                      } }
                            }
                        }
                    },                 
                    deadline_warning: {                       
                        $cond: {
                            if: {
                                $or: [
                                    { $eq: ['$expiration_date', null] }, 
                                    { $eq: ['$expiration_date', ''] },
                                    { $eq: ['$activation_date', null] }, 
                                    { $eq: ['$activation_date', ''] }   
                                ]
                                                           },
                            then:"",
                            else: {
                                $cond: {
                                    if: {
                                        $and: [
                                            { $lt: ['$expiration_date', new Date()] },                                                                 
                                          
                                        ]
                                                                   },
                                  then: 'Đã hết hạn',    //still return null                       
                                  else: {
                                    $cond: {
                                        if: {
                                            $and: [
                                                { $gt: ['$expiration_date', new Date()] },
                                                { $lt: ['$expiration_date', { $add: [new Date(), 30 * 24 * 60 * 60 * 1000] }] },
                                                { $lte: ['$warningDate', new Date()] }                                               
                                            ]
                                          },
                                      then: 'Sắp hết hạn',                           
                                      else: ""                                      
                                      
                                    }
                                  }
                                }
                              },
                        }
                    }
                },
            }, 
            {
                $project: {
                    _id: 1,
                    sim_status: 1,
                    deadline_warning:1,

                }
            }           

        ]);
        
        console.log(updateStatusSim);
        const updateCategoriesSim = await updateStatusSim.map(function(data) {
            const infoUpdate={
                sim_status:data.sim_status,
                deadline_warning: data.deadline_warning,
            }
            return CategoriesSim.findOneAndUpdate(
             data._id,{$set:infoUpdate}
            );
          });
         return Promise.all(updateCategoriesSim).then(data=>{
            data.forEach(res=>{
                res;
            })            
         })
         .catch(err=>{
            res.json({
                status: 500,
                success: false,
                error: err.message
            });
         });       
    
   
}
let create = async (req, res) => {
    try {        
        const getCategoriesSim = new CategoriesSim(req.body);
        getCategoriesSim.use_sim = '0';
        checkId = await CategoriesSim.find({ serial_sim: req.body.serial_sim }).count();
        if (checkId > 0) {
            return res.json({
                status:200,
                success: true, message: 'This ID exits!!',
            });
        }

        let getData = await getCategoriesSim.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
               // data: getData,
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
			
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }
}

let edit = async (req, res) => {
    try {
        const token = req.headers.token; 
        id = req.query.id;
        getId =await cryptJSon.encryptData(token, await CategoriesSim.findOne({ _id: id }));
        if (getId) {
            return res.json({
                status:200,
                success: true, message: 'Infomation Field need to edit!!', data: getId,
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
			

        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}

let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await CategoriesSim.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await CategoriesSim.findOne({ _id: id });
            return res.json({
                status:200,
                success: true, data: getNewData, message: 'Infomation field has been updated !!'
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
			
        }
    } 
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });
      
    }

}
const destroy = async (req, res) => {
    try {
        const id = req.query.id;       
        const semiProductCount = await SemiProduct.countDocuments({ categories_sim_id: id });
        if (semiProductCount > 0) {            
            return res.json({
                status:400,
                success: false,
                message: 'Cannot delete Categories Sim as it is linked to Semi Products'
            });
        }        
        await CategoriesSim.findByIdAndRemove(id)
        return res.json({
            status:200,
            success: true,
            message: 'Categories Sim has been deleted'
        });
    } catch (err) {
        console.log(err);
        res.json({
            status:500,
            success: false,
            error: err.message
        });
    }
};
let showNotification =async(req,res)=>
{
  getData=await Notification.find({}).sort({ createdAt: -1 });
  if(getData)
  { 
    return res.json({
    status:200,
    success: true,
    data:getData,
    message: 'Categories Sim has been deleted'
});

  }
}
module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
    updateStatusSim:updateStatusSim,   
    showNotification:showNotification,
}