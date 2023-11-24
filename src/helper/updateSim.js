const CategoriesSim = require('../app/models/categories_sim');
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
                            then: '',
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
                                    { $eq: ['$expiration_date', ''] }  
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
                                  then: 'Đã hết hạn',                           
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
                                      else: "Đang hoạt động"                                      
                                      
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
       // console.log(updateStatusSim);
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
module.exports = {
    updateStatusSim
};