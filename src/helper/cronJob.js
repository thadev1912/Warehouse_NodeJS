const cron = require('node-cron');
const IncrementCode = require('../app/models/increment_code_product_order');
const CategoriesSim = require('../app/models/categories_sim');
const Notification = require('../app/models/notification');
const NotificationUser = require('../app/models/user_notification');
const Telegram = require('./telegram');
const notifyRealtime = require('./notifyRealtime');
const User = require('../app/models/user');
const iconv = require('iconv-lite');
const scanStatusSim=async(req,res)=>
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
const startCronJob=async() =>{ 
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
         // Count Deadline Warning Sim One 20 Minutes  //Standard
         cron.schedule('*/10 * * * *', async() => {
              type=1;
              await scanStatusSim();         
              getCount= await CategoriesSim.find({deadline_warning:"Sắp hết hạn"}).countDocuments();       
              let today = new Date();
              dd = String(today.getDate()).padStart(2, '0');
              mm = String(today.getMonth() + 1).padStart(2, '0');
              yyyy = today.getFullYear();
              createDay = mm + '/' + dd + '/' + yyyy;
              isCompleted=true;
              if(getCount>0)
              {
                getNotification = new Notification({
                    content_notification: getCount,
                    date_notification: createDay,
                    type_notification: type,
                    action_notification: 'Create',                   
                })
                getData = await getNotification.save();              
                arrUser = await getType(type);                
                arrUser.map(async (user) => {
                    const getNotificationUser = new NotificationUser({
                        user_id: user,
                        notify_id: getNotification._id,
                        is_read: '0',
                    });
                    getData = await getNotificationUser.save();
                })
                isCompleted = getData > 0 ? true : false;
                const message= await showAlert();
                global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
                Telegram.sendMessageToGroup(message);
                          } 
              
              if(isCompleted)
              {
                  console.log(`Có ${getCount} sim sắp hết hạn`);
                
              }
            });
        // Count Deadline Warning Sim One New Day
        cron.schedule('0 0 * * *', async() => {
            type=1;
            await scanStatusSim();         
            getCount= await CategoriesSim.find({deadline_warning:"Sắp hết hạn"}).countDocuments();       
            let today = new Date();
            dd = String(today.getDate()).padStart(2, '0');
            mm = String(today.getMonth() + 1).padStart(2, '0');
            yyyy = today.getFullYear();
            createDay = mm + '/' + dd + '/' + yyyy;
            isCompleted=true;
            if(getCount>0)
            {
              getNotification = new Notification({
                  content_notification: getCount,
                  date_notification: createDay,
                  type_notification: type,
                  action_notification: 'Create',                   
              })
              getData = await getNotification.save();              
              arrUser = await getType(type);                
              arrUser.map(async (user) => {
                  const getNotificationUser = new NotificationUser({
                      user_id: user,
                      notify_id: getNotification._id,
                      is_read: '0',
                  });
                  getData = await getNotificationUser.save();
              })
              isCompleted = getData > 0 ? true : false;
              const message= await showAlert();
              global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
              Telegram.sendMessageToGroup(message);
                        } 
            
            if(isCompleted)
            {
                console.log(`Có ${getCount} sim sắp hết hạn`);
              
            }
            });
             // Count Deadline Warning Sim About 7h in New Day
        cron.schedule('0 7 * * *', async() => {
            type=1;
              await scanStatusSim();         
              getCount= await CategoriesSim.find({deadline_warning:"Sắp hết hạn"}).countDocuments();       
              let today = new Date();
              dd = String(today.getDate()).padStart(2, '0');
              mm = String(today.getMonth() + 1).padStart(2, '0');
              yyyy = today.getFullYear();
              createDay = mm + '/' + dd + '/' + yyyy;
              isCompleted=true;
              if(getCount>0)
              {
                getNotification = new Notification({
                    content_notification: getCount,
                    date_notification: createDay,
                    type_notification: type,
                    action_notification: 'Create',                   
                })
                getData = await getNotification.save();              
                arrUser = await getType(type);                
                arrUser.map(async (user) => {
                    const getNotificationUser = new NotificationUser({
                        user_id: user,
                        notify_id: getNotification._id,
                        is_read: '0',
                    });
                    getData = await getNotificationUser.save();
                })
                isCompleted = getData > 0 ? true : false;
                const message= await showAlert();
                global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
                Telegram.sendMessageToGroup(message);
                          } 
              
              if(isCompleted)
              {
                  console.log(`Có ${getCount} sim sắp hết hạn`);
                
              }
            });
                   // Count Deadline Warning Sim About 14h in New Day
        cron.schedule('0 14 * * *', async() => {
            type=1;
              await scanStatusSim();         
              getCount= await CategoriesSim.find({deadline_warning:"Sắp hết hạn"}).countDocuments();       
              let today = new Date();
              dd = String(today.getDate()).padStart(2, '0');
              mm = String(today.getMonth() + 1).padStart(2, '0');
              yyyy = today.getFullYear();
              createDay = mm + '/' + dd + '/' + yyyy;
              isCompleted=true;
              if(getCount>0)
              {
                getNotification = new Notification({
                    content_notification: getCount,
                    date_notification: createDay,
                    type_notification: type,
                    action_notification: 'Create',                   
                })
                getData = await getNotification.save();              
                arrUser = await getType(type);                
                arrUser.map(async (user) => {
                    const getNotificationUser = new NotificationUser({
                        user_id: user,
                        notify_id: getNotification._id,
                        is_read: '0',
                    });
                    getData = await getNotificationUser.save();
                })
                isCompleted = getData > 0 ? true : false;
                const message= await showAlert();
                global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
                Telegram.sendMessageToGroup(message);
                          } 
              
              if(isCompleted)
              {
                  console.log(`Có ${getCount} sim sắp hết hạn`);
                
              }
            });
                           // Count Deadline Warning Sim About 20h in New Day
        cron.schedule('0 20 * * *', async() => {
            type=1;
              await scanStatusSim();         
              getCount= await CategoriesSim.find({deadline_warning:"Sắp hết hạn"}).countDocuments();       
              let today = new Date();
              dd = String(today.getDate()).padStart(2, '0');
              mm = String(today.getMonth() + 1).padStart(2, '0');
              yyyy = today.getFullYear();
              createDay = mm + '/' + dd + '/' + yyyy;
              isCompleted=true;
              if(getCount>0)
              {
                getNotification = new Notification({
                    content_notification: getCount,
                    date_notification: createDay,
                    type_notification: type,
                    action_notification: 'Create',                   
                })
                getData = await getNotification.save();              
                arrUser =await getType(type);                
                arrUser.map(async (user) => {
                    const getNotificationUser = new NotificationUser({
                        user_id: user,
                        notify_id: getNotification._id,
                        is_read: '0',
                    });
                    getData = await getNotificationUser.save();
                })
                isCompleted = getData > 0 ? true : false;
                const message= await showAlert();
                global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
                Telegram.sendMessageToGroup(message);
                          }               
              if(isCompleted)
              {
                  console.log(`Có ${getCount} sim sắp hết hạn`);
                
              }
            });
}
const showAlert =async()=>
{
    getInfoWarningSim=await CategoriesSim.aggregate([
        {
            $match:
            {
                deadline_warning:"Sắp hết hạn"
            }
        }
    ]);   
   const serialSims = getInfoWarningSim.map(sim => sim.serial_sim);
   console.log('thông tin những sim sắp hết hạn là',serialSims);
   const icon = '🚨'; 
   const simDetails = getInfoWarningSim.map(sim => `⚠️ ${sim.serial_sim}`);
  return `${icon} Có ${getCount} sim sắp hết hạn, - Chi tiết :\n${simDetails.join('\n')}.\n Thông tin đến nhóm`;
}
const getType = async (type) => {
    const getUsersByRolePermission = await User.aggregate([
        {
            $lookup: {
                from: 'user_roles',
                localField: '_id',
                foreignField: 'user_id',
                as: 'userRole',
            },
        },
        {
            $unwind: '$userRole',
        },
        {
            $lookup: {
                from: 'role_permissions',
                localField: 'userRole.role_permission_id',
                foreignField: '_id',
                as: 'rolePermission',
            },
        },
        {
            $unwind: {
                path: '$rolePermission',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $match: {
                'rolePermission.role_notification_group': { $regex: String(type) },
            }
        },
        {
            $group: {
                _id: '$_id',
            }
        },
    ]);

    return getUsersByRolePermission.map(user => user._id.toString('hex'));
}
module.exports =
{startCronJob,
scanStatusSim,
showAlert,
getType,
}
   


