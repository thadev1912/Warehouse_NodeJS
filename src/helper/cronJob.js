const cron = require('node-cron');
const IncrementCode = require('../app/models/increment_code_product_order');
const CategoriesSim = require('../app/models/categories_sim');
const Notification = require('../app/models/notification_sim');
function startCronJob() {   

    // Run The First Day in New Year
    cron.schedule('0 0 1 1 *', async () => {
        let currentYear = new Date().getFullYear().toString().slice(-2);
        getlastInvoice = await IncrementCode.findOne().sort({ created: -1 }).select('invoice_number');
        let invoiceNumber = getlastInvoice.invoice_number;
        let getlastYear = invoiceNumber.match(/YCSX(\d+)\.\d+/);
        let _getlastYear = getlastYear ? getlastYear[1] : null;
        if (currentYear !== _getlastYear) {
            getvalue = '001';
            invoice_number = 'YCSX' + currentYear + '.' + getvalue;
            const getInvoice = new IncrementCode({
                invoice_number: invoice_number,
            });
            await getInvoice.save();
        }
    });
    //Update Sim in New Day
    cron.schedule('0 0 * * * ', async() => {
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
                                    { $eq: [{ $ifNull: ['$activation_date', null] }, null] },  //check $activation_date null
                                    { $eq: ['$activation_date', null] }, 
                                    { $eq: ['$activation_date', ''] }, 
                                    { $eq: ['$expiration_date', null] }, 
                                    { $eq: ['$expiration_date', ''] }  
                                ]
                                                           },
                            then:"",
                            else: {
                                $cond: {
                                    if: {
                                        $and: [
                                          //  { $lt: ['$expiration_date', new Date()] },  
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
       console.log(updateStatusSim);
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
        
    });
     // Count Deadline Warning Sim One New Day
      cron.schedule('0 0 * * * ', async() => {
        getCount= await CategoriesSim.find({deadline_warning:"Sắp hết hạn"}).countDocuments();
        //console.log(getCount);
        let today = new Date();
        dd = String(today.getDate()).padStart(2, '0');
        mm = String(today.getMonth() + 1).padStart(2, '0');
        yyyy = today.getFullYear();
        createDay = mm + '/' + dd + '/' + yyyy;
        isCompleted=true;
        if(getCount>0)
        {
            getNotification=new Notification({
                content_notification:getCount,
                date_notification:createDay,
                type_notification:'1',
            })
             getData =await getNotification.save();
             isCompleted=getData>0?true:false;
             global.io.emit('eventChange',`Có ${getCount} sim sắp hết hạn`);   
        }       
        if(isCompleted)
        {
            console.log('cập nhật tổng số lượng sim sắp hết hạn mới thành công!!!');
          
        }
      });
    

}
module.exports = startCronJob;
