
const CategoriesSim = require('../models/categories_sim');
const SemiProduct = require('../models/semi_product');
const Notification = require('../models/notification_sim');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
const { paginate1 } = require('../../helper/pagination');
let index = async (req, res) => {
    try { 
        const token = req.headers.token; 
       getStatus= await updateStatusSim();   
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
            {
                $sort: {
                    created: -1 
                }
            },

        ]));
        if (getSemiProduct) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data: getSemiProduct,getStatus
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
let indexEsim = async (req, res) => {
    try { 
        const token = req.headers.token; 
       getStatus= await updateStatusSim();   
     let getSemiProduct =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await CategoriesSim.aggregate([  
        {
            $match:
            {
                sim_type:'E-SIM'
            }
        },              
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
                message: 'Get Data Completed',
                data: getSemiProduct,getStatus
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
let indexSim = async (req, res) => {
    try { 
        const token = req.headers.token; 
       getStatus= await updateStatusSim();   
     let getSemiProduct =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await CategoriesSim.aggregate([  
        {
            $match:
            {
                sim_type:'SIM'
            }
        },              
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
                message: 'Get Data Completed',
                data: getSemiProduct,getStatus
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
let updateStatusSim=async(res,req)=>
{          
        let updateStatusSim = await CategoriesSim.aggregate([           
            {
                $addFields: {  
                    warningDate: {                       
                       $subtract: ["$expiration_date", 30 * 24 * 60 * 60 * 1000] 
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
                            },
                            then: 'Đã hết hạn',                          
                            else:{
                                $cond: {
                                    if:{                                   
                                              $eq: ["$activation_date", ""],                                        
                                          },
                                     then: "Chưa kích hoạt",
                                      else: {
                                        $cond:{
                                            if:{$eq: [ { $ifNull: ["$activation_date", null] }, null]},
                                            then:'Chưa kích hoạt',
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
                                   { $eq: [{ $ifNull: ['$activation_date', null] }, null] },
                                   { $eq: [{ $ifNull: ['$activation_date', null] }, ''] },
                                   { $eq: [{ $ifNull: ['$expiration_date', null] }, null] },
                                   { $eq: [{ $ifNull: ['$expiration_date', null] }, ''] }                                 
                                ]
                                                           },
                            then:"",
                            else: {
                                $cond: {
                                    if: {
                                        $and: [
                                                                                                       
                                          {  $lt: [{ $add: ['$expiration_date', 24 * 60 * 60 * 1000] }, new Date()]} ,   
                                        ]
                                                                   },
                                  then: 'Đã hết hạn',                      
                                  else: {
                                    $cond: {
                                        if: {
                                            $and: [
                                                { $gt: [{ $add: ['$expiration_date', 24 * 60 * 60 * 1000] }, new Date()] },
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
       
        const updateCategoriesSim = await updateStatusSim.map(function(data) {
            const infoUpdate={
                sim_status:data.sim_status,
                deadline_warning: data.deadline_warning,
            }
            return CategoriesSim.findOneAndUpdate(
             data._id,{$set:infoUpdate},{ new: true, useFindAndModify: false }
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
                success: true, message: 'This ID exits',
            });
        }

        let getData = await getCategoriesSim.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted',
               // data: getData,
            });
            setLogger.logStore(getInfoUser,req);
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
                success: true, message: 'Infomation Field need to edit', data: getId,
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
        req.body.updated=new Date();
        let id = req.params.id;
        getData = await CategoriesSim.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await CategoriesSim.findOne({ _id: id });
             res.json({
                status:200,
                success: true, data: getNewData, message: 'Infomation field has been updated'
            });
            setLogger.logUpdate(getInfoUser,req);
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
             res.json({
                status:400,
                success: false,
                message: 'Cannot delete Categories Sim as it is linked to Semi Products'
            });
            setLogger.logDelete(getInfoUser,req); 
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
  const token = req.headers.token;  
  //countData=await Notification.find({is_read:'0'}).sort({ created: -1 }).countDocuments();
  getData=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await Notification.find().sort({ created: -1 }));
  coverData=await cryptJSon.decryptData(token,configCrypt.encryptionEnabled,getData); 
  countNotRead=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await Notification.find({is_read:'0'}).countDocuments());
  coverCount=await cryptJSon.decryptData(token,configCrypt.encryptionEnabled,countNotRead);
  if(getData)
  { 
    return res.json({
    status:200,
    success: true,
    data:getData,countNotRead,coverData,coverCount,
    message: 'get Infomation Completed'
});

  }
}
let showNotification1 =async(req,res)=>
{
  const token = req.headers.token;  
  //countData=await Notification.find({is_read:'0'}).sort({ created: -1 }).countDocuments();
  getData=await Notification.findOne().sort({ created: -1 });
 
  countNotRead=await Notification.find({is_read:'0'}).countDocuments();
  hasUpdate='Active';
  if(getData)
  { 
    return res.json({
    status:200,
    success: true,
    data:countNotRead,hasUpdate,getData,
    message: 'get Infomation Completed'
});

  }
}
const updateNotification =async(req,res)=>
{
    
    req.body.updated=new Date();
    let id = req.params.id;  
    console.log(req.params.id);
    console.log(req.body);
    getData = await Notification.findByIdAndUpdate(id, { $set: req.body })
    if (getData) {
        getNewData = await Notification.findOne({ _id: id });
        res.json({
            status:200,
            success: true, message: 'Infomation field has been updated'
        });       
    }
    else {
         res.json({
            status:500,
            success: false,                
            message: 'Error connecting Database on Server'
        });
    }

}
const testRef=async(req,res)=>
{
    const result = await CategoriesSim.find().populate('sim_package_id');
    res.json(result);
}
module.exports = {
    index: index,
    indexEsim,
    indexSim,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
    updateStatusSim:updateStatusSim,   
    showNotification:showNotification,
    updateNotification:updateNotification,
    testRef:testRef,
    showNotification1:showNotification1,
}